export interface FungibleAssetInfo {
  symbol: string;
  name: string;
  decimals: number;
  asset_type: string;
  icon_uri?: string;
  __typename: string;
}

/**
 * Fetch fungible asset info/metadata from the indexer
 * Checks both modern FA metadata and legacy Coin metadata
 */
export const fetchFungibleAssetInfo = async (
  indexerUrl: string,
  assetTypes: string[]
): Promise<FungibleAssetInfo[]> => {
  const fetchMetadata = async (query: string, resultKey: string) => {
    try {
      const response = await fetch(indexerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { in: assetTypes, offset: 0 } }),
      });
      const result = await response.json();
      return result.data?.[resultKey] || [];
    } catch (e) {
      console.warn(`[Indexer] Metadata query for ${resultKey} failed:`, e);
      return [];
    }
  };

  const faMetaQuery = `query GetFAMeta($in: [String!], $offset: Int) {
      fungible_asset_metadata(where: { asset_type: { _in: $in } }, offset: $offset, limit: 100) {
        symbol name decimals asset_type icon_uri __typename
      }
    }`;

  const coinMetaQuery = `query GetCoinMeta($in: [String!]) {
      coin_infos(where: { coin_type: { _in: $in } }) {
        symbol: symbol name: name decimals: decimals asset_type: coin_type __typename
      }
    }`;

  try {
    const [faMeta, coinMeta] = await Promise.all([
      fetchMetadata(faMetaQuery, 'fungible_asset_metadata'),
      fetchMetadata(coinMetaQuery, 'coin_infos')
    ]);

    const combinedMap = new Map();

    // Add FA metadata
    faMeta.forEach((m: any) => combinedMap.set(m.asset_type, { ...m }));

    // Add Coin metadata (if not already there)
    coinMeta.forEach((m: any) => {
      if (!combinedMap.has(m.asset_type)) {
        combinedMap.set(m.asset_type, { ...m });
      }
    });

    return Array.from(combinedMap.values());
  } catch (error) {
    console.error('[Indexer] fetchFungibleAssetInfo combined failed:', error);
    return [];
  }
};

/**
 * Fetch all balances (Fungible Assets and Coins) for an address
 * Uses separate queries to avoid failure if one table isn't supported
 */
export const fetchAccountBalances = async (
  indexerUrl: string,
  address: string
): Promise<any[]> => {
  const normalizedAddress = address.toLowerCase();
  const fetchTable = async (query: string, resultKey: string) => {
    try {
      const response = await fetch(indexerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { address: normalizedAddress } }),
      });
      const result = await response.json();
      return result.data?.[resultKey] || [];
    } catch (e) {
      console.warn(`[Indexer] Query for ${resultKey} failed:`, e);
      return [];
    }
  };

  const faQuery = `query GetFA($address: String!) {
        current_fungible_asset_balances_new(where: { owner_address: { _eq: $address }, amount: { _gt: "0" } }) {
            asset_type amount
        }
    }`;

  const coinQuery = `query GetCoins($address: String!) {
        current_coin_balances(where: { owner_address: { _eq: $address }, amount: { _gt: "0" } }) {
            coin_type amount
        }
    }`;

  // Fallback for older indexer schemas
  const legacyFaQuery = `query GetLegacyFA($address: String!) {
        current_fungible_asset_balances(where: { owner_address: { _eq: $address }, amount: { _gt: "0" } }) {
            asset_type amount
        }
    }`;

  try {
    const [fa, coins, legacyFa] = await Promise.all([
      fetchTable(faQuery, 'current_fungible_asset_balances_new'),
      fetchTable(coinQuery, 'current_coin_balances'),
      fetchTable(legacyFaQuery, 'current_fungible_asset_balances')
    ]);

    const combinedMap = new Map();

    // Add FA results
    fa.forEach((item: any) => combinedMap.set(item.asset_type, item.amount));

    // Add Legacy FA results (priority to new table)
    legacyFa.forEach((item: any) => {
      if (!combinedMap.has(item.asset_type)) {
        combinedMap.set(item.asset_type, item.amount);
      }
    });

    // Add Coin results
    coins.forEach((item: any) => {
      if (!combinedMap.has(item.coin_type)) {
        combinedMap.set(item.coin_type, item.amount);
      }
    });

    return Array.from(combinedMap.entries()).map(([type, amt]) => ({
      asset_type: type,
      amount: amt
    }));
  } catch (error) {
    console.error('[Indexer] fetchAccountBalances combined failed:', error);
    return [];
  }
};
/**
 * Fetch account activities from the indexer
 */
export const fetchAccountActivities = async (
  indexerUrl: string,
  address: string,
  limit: number = 50
): Promise<any[]> => {
  const normalizedAddress = address.toLowerCase();
  const query = `
    query GetFungibleAssetActivities($address: String!, $limit: Int!) {
      fungible_asset_activities(
        where: { owner_address: { _eq: $address } }
        order_by: { transaction_timestamp: desc }
        limit: $limit
      ) {
        transaction_version
        event_index
        owner_address
        asset_type
        amount
        type
        transaction_timestamp
      }
    }
  `;

  try {
    const response = await fetch(indexerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: { address: normalizedAddress, limit },
      }),
    });

    const result = await response.json();
    return result.data?.fungible_asset_activities || [];
  } catch (error) {
    console.error('[Indexer] fetchAccountActivities failed:', error);
    return [];
  }
};

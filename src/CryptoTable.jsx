import React, { useEffect, useState } from 'react';

// Component to display and interact with cryptocurrency data
const CryptoTable = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedByMarketCap, setSortedByMarketCap] = useState(false);
  const [sortedByChange, setSortedByChange] = useState(false);

  // Method 1: Fetch data using .then
  const fetchDataWithThen = () => {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')
      .then(response => response.json())
      .then(data => {
        setCryptoData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  // Method 2: Fetch data using async/await
  const fetchDataWithAsyncAwait = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
      const data = await response.json();
      setCryptoData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Filter the data based on search term
  const filteredData = cryptoData.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort the data by market cap or percentage change
  const sortData = (type) => {
    const sortedData = [...cryptoData];
    if (type === 'market_cap') {
      sortedData.sort((a, b) => (sortedByMarketCap ? a.market_cap - b.market_cap : b.market_cap - a.market_cap));
      setSortedByMarketCap(!sortedByMarketCap); // Toggle sort order
    } else if (type === 'change') {
      sortedData.sort((a, b) => (sortedByChange ? a.price_change_percentage_24h - b.price_change_percentage_24h : b.price_change_percentage_24h - a.price_change_percentage_24h));
      setSortedByChange(!sortedByChange); // Toggle sort order
    }
    setCryptoData(sortedData);
  };

  // Use either fetch method here, depending on your preference
  useEffect(() => {
    fetchDataWithAsyncAwait(); // Or fetchDataWithThen();
  }, []);

  return (
    <div>
      <h1>Cryptocurrency Dashboard</h1>

      <div>
        <input
          type="text"
          placeholder="Search for a cryptocurrency..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => sortData('market_cap')}>Sort by Market Cap</button>
        <button onClick={() => sortData('change')}>Sort by 24h % Change</button>
      </div>

      <table border="1" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Symbol</th>
            <th>Current Price (USD)</th>
            <th>Total Volume</th>
            <th>Market Cap</th>
            <th>24h % Change</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((crypto) => (
            <tr key={crypto.id}>
              <td><img src={crypto.image} alt={crypto.name} width="25" /></td>
              <td>{crypto.name}</td>
              <td>{crypto.symbol}</td>
              <td>${crypto.current_price}</td>
              <td>{crypto.total_volume}</td>
              <td>${crypto.market_cap.toLocaleString()}</td>
              <td>{crypto.price_change_percentage_24h}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;

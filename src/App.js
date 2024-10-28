import { type } from "@testing-library/user-event/dist/type";
import { useEffect, useState } from "react";

function App() {
  const [icoeBalances, setICOEAccountBalances] = useState([]);
  const [aiBalances, setAIAccountBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {

    setLoading(true);

    const fetchIcoeBalances = fetch("http://ec2-13-59-140-119.us-east-2.compute.amazonaws.com:9200/api/v1/owner/accounts").then((response) => response.json());
    const fetchAiBalances =   fetch("http://ec2-13-59-140-119.us-east-2.compute.amazonaws.com:9300/api/v1/owner/accounts").then((response) => response.json());

    Promise.all([fetchIcoeBalances, fetchAiBalances])
      .then(([iBalances, aBalances]) => {
        setICOEAccountBalances(iBalances.payload);
        setAIAccountBalances(aBalances.payload);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
    };

    // Fetch data immediately on mount
    fetchData();

    // Set up an interval to fetch data every 5 seconds
    const intervalId = setInterval(fetchData, 30000);

    // Clear interval on component unmount to prevent memory leaks
    return () => clearInterval(intervalId);
  }, []);
  

  const filteredIcoeBalances = icoeBalances
    .filter(icoe => icoe.id !== "icoe") // Exclude users with name "John Doe"
    .sort((a, b) => a.id.localeCompare(b.id)); // Sort users alphabetically by name


  const filteredAiBalances = aiBalances
    .filter(ai => ai.id !== "ai") // Exclude posts with title "Untitled"
    .sort((a, b) => a.id.localeCompare(b.id)); // Sort users alphabetically by name


  const alternateNames = {
    "rahul": "Rahul Nair",
    "ashish": "Ashish Jain",
    "swapna": "Swapna LastName",
    "hari": "Hari Nadathur",
    // Add more mappings as needed
  };


  return (
    <div className="App">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h2>ICOE Balances</h2>

          <table border={1}>
            <tr>
              <th>Name</th>
              <th>Balance</th>
            </tr>
            {filteredIcoeBalances.map((account) => (
              <tr key={account.id}>
                <td>
                  {alternateNames[account.id] || account.id}
                </td>
                <td>{`Ⓜ${account.balance[0].value}`}</td>
              </tr>
            ))}
          </table>

          <h2>AI Balances</h2>

          <table border={1}>
            <tr>
              <th>Name</th>
              <th>Balance</th>
            </tr>
            {filteredAiBalances.map((account) => (
              <tr key={account.id}>
                <td>
                  {alternateNames[account.id] || account.id}
                </td>
                <td>{`Ⓜ${account.balance[0].value}`}</td>
              </tr>
            ))}
          </table>

        </>
      )}
    </div>
  );
}

export default App;

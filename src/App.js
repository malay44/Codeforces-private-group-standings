import { useEffect } from "react";
import "./styles.css";

export default function App() {
  useEffect(() => {
    const fetchData = async () => {
      const api_key = process.env.REACT_APP_CF_API_KEY;
      const contest_id = "436414";
      const group_code = "RXDkSayhcW";
      const api_secret = process.env.REACT_APP_CF_API_secret;

      const rand = Math.floor(Math.random() * 100000)
        .toString()
        .padStart(6, "0");
      const current_time = Math.floor(Date.now() / 1000).toString();

      const api_sig =
        rand +
        "/contest.standings?apiKey=" +
        api_key +
        "&contestId=" +
        contest_id +
        "&groupCode=" +
        group_code +
        "&time=" +
        current_time +
        "#" +
        api_secret;

      const hash = await crypto.subtle.digest(
        "SHA-512",
        new TextEncoder().encode(api_sig)
      );
      const hashArray = Array.from(new Uint8Array(hash));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      const apiEndpoint = `https://codeforces.com/api/contest.standings?groupCode=${group_code}&contestId=${contest_id}&apiKey=${api_key}&time=${current_time}&apiSig=${
        rand + hashHex
      }`;

      try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();
        const result = data.result.rows.map((element) => {
          return element.party.members[0].handle;
        });
        console.log(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}

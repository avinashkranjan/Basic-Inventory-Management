import React from "react";

function Table_3rdAPI() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        const json = await response.json();
        console.log(json);
        setData(json);
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return "Loading...";
  if (error) return "Error!";
  if (data)
    return (
      <div>
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="h-16 w-full text-sm leading-none text-gray-800">
              <th className="font-normal text-left pl-4">Id</th>
              <th className="font-normal text-left pl-4">Name</th>
              <th className="font-normal text-left pl-12">Email</th>
              <th className="font-normal text-left pl-12">Contact</th>
            </tr>
          </thead>

          <tbody className="w-full">
            {data.map((item) => (
              <tr
                className="h-20 text-sm leading-none text-gray-800 bg-white hover:bg-gray-100 border-b border-t border-gray-100"
                key={item.id}
              >
                <td className="pl-4">
                  <p className="pl-3 text-sm font-medium leading-none text-gray-800">
                    {item.id}
                  </p>
                </td>

                <td>
                  {item.name}
                  <br />
                  {item.username}
                </td>

                <td>{item.email}</td>

                <td>
                  {item.phone}
                  <br />
                  {item.website}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}

export default Table_3rdAPI;

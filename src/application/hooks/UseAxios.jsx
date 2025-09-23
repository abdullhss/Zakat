// import { useState, useEffect } from "react";
// import axios from "axios";

// function UseAxios(url, body, method) {
// const [data, setData] = useState(null);
// const [loading, setLoading] = useState(true);
// const [error, setError] = useState(null);

// useEffect(() => {
//     if (method === "get") {
//     console.log();
//     } else if (method === "post") {
//     const fetchData = async () => {
//         try {
//         const response = await axios.post(url, body);
//         setData(response.data);
//         console.log(response);
//         } catch (err) {
//         setError(err.message);
//         }
//         setLoading(false);
//     };

//     fetchData();
//     }
// }, [url]);

// return { data, loading, error };
// }

// export default UseAxios;

// // UseAxios('/test/  id  ')

import { useState, useEffect } from "react";
import axios from "axios";

function UseAxios({ url, method = "get", body = null, headers = {} }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios({
          url,
          method,
          data: body,
          headers,
        });
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err.message || "An error occurred");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }
  }, [url, method, JSON.stringify(body), JSON.stringify(headers)]);

  return { data, loading, error };
}

export default UseAxios;

//* USAGE
// //* POst
// const { data, loading, error } = UseAxios({
//   url: "https://dummyjson.com/products/add",
//   method: "post",
//   body: { title: "BMW Pencil" },
// });

// console.log(data);


// //* GET
// const { data, loading, error } = UseAxios({
//   url: "https://dummyjson.com/products/category/smartphones",
//   method: "get",
// });

// console.log(data);

// //* PUT

// const { data, loading, error } = useAxios({
//   url: "/api/item/1",
//   method: "put",
//   body: { name: "Updated name" },
// });

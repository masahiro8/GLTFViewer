import axios from "axios";
export const loader = async (uri) => {
  console.log("loader uri ", uri);
  axios
    .get(uri, {
      // responseType: "blob"
      responseType: "arrayBuffer"
    })
    .then((response) => {
      console.log(response.data.length);
    })
    .catch((error) => {
      console.log("error =", error);
    });
};

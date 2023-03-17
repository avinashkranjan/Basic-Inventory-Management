import React, { useEffect, useState } from "react";
import axios from "axios";
import AWS from "aws-sdk";

function Table() {
  const [productData, setProductData] = useState([]);
  const [productEdit, setProductEdit] = useState();
  const [show, setShow] = useState(false);
  const [dialogType, setDialogType] = useState("add");
  const [refresh, setRefresh] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [actionLoaded, setActionLoaded] = useState(true);

  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(null);
  const [image, setImage] = useState("");

  const [imagePreview, setImagePreview] = useState("");
  const [errProductName, setErrProductName] = useState("");
  const [errQuantity, setErrQuantity] = useState("");
  const [errImage, setErrImage] = useState("");

  AWS.config.update({
    region: "ap-south-1",
    accessKeyId: "AKIAXPQE4EDOT2DVAJPV",
    secretAccessKey: "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",
  });

  const s3 = new AWS.S3({
    params: { Bucket: "myawsbucket-free" },
  });

  useEffect(() => {
    setIsLoaded(true);
    axios
      .get("http://localhost:5000/api/inventory/product")
      .then((res) => {
        console.log(res.data);
        setProductData(res.data);
        setIsLoaded(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);

  const updateProduct = async (id) => {
    setActionLoaded(true);
    console.log(id);
    await axios
      .put(`http://localhost:5000/api/inventory/product/${id}`)
      .then((res) => {
        console.log(res.data);
        setRefresh(!refresh);
        setActionLoaded(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFileChange = (event) => {
    setActionLoaded(true);
    setImagePreview(URL.createObjectURL(event.target.files[0]));
    const file = event.target.files[0];
    const fileType = event.target.files[0].name.substring(
      event.target.files[0].name.lastIndexOf(".") + 1
    );
    const fileName = file.name;

    s3.upload(
      {
        Key: `images/${fileName}_${new Date().getTime()}.${fileType}`,
        Body: file,
        ACL: "public-read",
      },
      (err, data) => {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Upload success", data.Location);
          setImage(data.Location);
          setActionLoaded(false);
        }
      }
    );
  };

  const handleSubmit = async () => {
    if (image.myFile === "") {
      setErrImage("Image is required");
    } else {
      setErrImage("");
    }
    if (productName === "") {
      setErrProductName("Product Name is required");
    } else {
      setErrProductName("");
    }

    if (quantity === null) {
      setErrQuantity("Quantity is required");
    } else {
      setErrQuantity("");
    }

    setActionLoaded(true);
    const addProductData = {
      productName: productName,
      quantity: quantity,
      imageUrl: image,
    };

    console.log("Product to Add:", addProductData);

    axios
      .post("http://localhost:5000/api/inventory/product", addProductData)
      .then((result) => {
        console.log(result);
        setRefresh(!refresh);
        setProductName("");
        setQuantity(null);
        setImage("");
        setShow(false);
        setErrProductName("");
        setErrQuantity("");
        setErrImage("");
        setImagePreview("");
        setActionLoaded(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {show ? (
        dialogType === "add" ? (
          <div
            className="relative z-10"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3
                          className="text-lg leading-6 font-medium text-gray-900 my-3"
                          id="modal-title"
                        >
                          Add Product
                        </h3>
                        <div className="mt-2">
                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-bold mb-2"
                              htmlFor="productImage"
                            >
                              Product Image
                            </label>
                            <div className="flex">
                              <img
                                className="h-20 w-20 mr-2"
                                src={
                                  imagePreview === ""
                                    ? "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930"
                                    : imagePreview
                                }
                                alt="preview"
                              />
                              <input
                                className={`${
                                  errImage !== "" ? "border-red-500" : ""
                                } "h-10 mt-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"`}
                                id="productImage"
                                type="file"
                                onChange={(e) => {
                                  console.log(e.target.files);
                                  handleFileChange(e);
                                }}
                                accept="image/png, image/jpeg, image/jpg"
                                placeholder="Product Image"
                              />
                              {errImage !== "" ? (
                                <p className="text-red-500 text-xs italic">
                                  {errImage}
                                </p>
                              ) : null}
                            </div>
                          </div>
                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-bold mb-2"
                              htmlFor="productName"
                            >
                              Product Name
                            </label>
                            <input
                              className={`${
                                errProductName !== "" ? "border-red-500" : ""
                              } "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"`}
                              id="productName"
                              onChange={(e) => setProductName(e.target.value)}
                              type="text"
                              placeholder="Product Name"
                            />
                            {errProductName !== "" ? (
                              <p className="text-red-500 text-xs italic">
                                {errProductName}
                              </p>
                            ) : null}
                          </div>
                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-bold mb-2"
                              htmlFor="quantity"
                            >
                              Quantity
                            </label>
                            <input
                              className={`${
                                errQuantity !== "" ? "border-red-500" : ""
                              } "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"`}
                              id="quantity"
                              onChange={(e) =>
                                setQuantity(parseInt(e.target.value))
                              }
                              type="number"
                              placeholder="Quantity"
                            />
                            {errQuantity !== "" ? (
                              <p className="text-red-500 text-xs italic">
                                {errQuantity}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      onClick={
                        actionLoaded
                          ? () => console.log("Loading...")
                          : handleSubmit
                      }
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    >
                      {actionLoaded ? (
                        <div className="flex items-center justify-center">
                          <div
                            className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                            role="status"
                          >
                            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                              Loading...
                            </span>
                          </div>
                        </div>
                      ) : (
                        "Add Product"
                      )}
                    </button>
                    <button
                      onClick={() => setShow(false)}
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="relative z-10"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3
                          className="text-lg leading-6 font-medium text-gray-900 my-3"
                          id="modal-title"
                        >
                          Update Product
                        </h3>
                        <div className="mt-2">
                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-bold mb-2"
                              htmlFor="productName"
                            >
                              Product Image
                            </label>
                            <div className="flex">
                              <img
                                src={productEdit.imageUrl}
                                className="w-20 h-20 mr-4 border-2 border-black rounded"
                                alt="product"
                              />
                              <input
                                className="shadow h-10 mt-4 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="productName"
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                placeholder="Product Image"
                              />
                            </div>
                          </div>

                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-bold mb-2"
                              htmlFor="productName"
                            >
                              Product Name
                            </label>
                            <input
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="productName"
                              value={productEdit.productName}
                              type="text"
                              placeholder="Product Name"
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-bold mb-2"
                              htmlFor="quantity"
                            >
                              Quantity
                            </label>
                            <input
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="quantity"
                              value={productEdit.quantity}
                              type="text"
                              placeholder="Quantity"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      onClick={() => updateProduct(productEdit._id)}
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setShow(false)}
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      ) : null}
      <div className="w-full sm:px-6">
        <div className="px-4 md:px-10 py-4 md:py-7 bg-gray-100 rounded-tl-lg rounded-tr-lg">
          <div className="sm:flex items-center justify-between">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800">
              Inventory
            </p>
            <div>
              <button
                onClick={() => [setShow(true), setDialogType("add")]}
                className="inline-flex sm:ml-3 mt-4 sm:mt-0 items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded"
              >
                <p className="flex text-sm font-medium leading-none text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 mr-2 -mt-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                      clipRule="evenodd"
                    />
                  </svg>
                  New Item
                </p>
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white shadow px-4 md:px-10 pt-4 md:pt-7 pb-5 overflow-y-auto">
          {isLoaded ? (
            <div className="flex items-center justify-center">
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
            </div>
          ) : productData.length === 0 ? (
            <div>
              <p className="text-center text-gray-500 text-xl font-medium">
                No Products Found
              </p>
            </div>
          ) : (
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="h-16 w-full text-sm leading-none text-gray-800">
                  <th className="font-normal text-left pl-4">Sl No.</th>
                  <th className="font-normal text-left pl-4">Product</th>
                  <th className="font-normal text-left pl-12">Quantity</th>
                  <th className="font-normal text-left pl-12"></th>
                </tr>
              </thead>

              {productData.map((product, index) => {
                return (
                  <tbody className="w-full" key={product.id}>
                    <tr className="h-20 text-sm leading-none text-gray-800 bg-white hover:bg-gray-100 border-b border-t border-gray-100">
                      <td className="pl-4">
                        <p className="pl-3 text-sm font-medium leading-none text-gray-800">
                          {index + 1}
                        </p>
                      </td>

                      <td className="pl-4 cursor-pointer">
                        <div className="flex items-center">
                          <div className="w-10 h-10">
                            <img
                              className="w-full h-full"
                              src={product.imageUrl}
                              alt="avatar"
                            />
                          </div>
                          <div className="pl-4">
                            <p className="font-medium">{product.productName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="pl-12">
                        <p className="pl-3 text-sm font-medium leading-none text-gray-800">
                          {product.quantity}
                        </p>
                      </td>

                      <td className="px-7 2xl:px-0 mt-4">
                        <button
                          onClick={() => [
                            setShow(true),
                            setProductEdit(product),
                            setDialogType("edit"),
                          ]}
                          className="flex focus:outline-none border-2 border-black p-3 bg- rounded mr-2 hover:bg-slate-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4 mr-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                          </svg>
                          Update
                        </button>
                      </td>
                    </tr>
                  </tbody>
                );
              })}
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Table;

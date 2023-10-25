import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import GetAccount from "../components/Lightning/GetAccount.js";
import DisplayAccount from "../components/Lightning/DisplayAccount.js";
import QRCard from "../components/Lightning/QRCard.js";
import "../App.css";
import emailjs from '@emailjs/browser';

const Home = (props) => {
  const [ListarInformacion, setListarInformacion] = useState([]);
  const ListarRegistros = async () => {
    if (props.contractproductos) {
      try {
        const Counter = await props.contractproductos.methods
          .productCount()
          .call();

        let arrayTarea = [];

        for (let i = 0; i <= Counter; i++) {
          const infotarea = await props.contractproductos.methods
            .products(i)
            .call();

          if (infotarea) {
            const tarea = {
              id: infotarea.id,
              name: infotarea.name,
              price: infotarea.price,
              description: infotarea.description,
            };
            //console.log(tarea);
            arrayTarea.push(tarea);
          }
        }
        //console.log(arrayTarea);
        setListarInformacion(arrayTarea);
      } catch (error) {
        console.error("Error al actualizar valor:", error);
      }
    }
  };

  useEffect(() => {
    ListarRegistros();
  }, [props.contractproductos]);

  const [myList, setMyList] = useState([]);
  const [formData, setFormData] = useState({
    product: "",
    price: "",
    amount: "1",
  });
  const [totalSum, setTotalSum] = useState(0);
  const [totalProds, setTotalProds] = useState(0);
  //const [totalProds, setTotalProds] = useState(0);

  useEffect(() => {
    const cookieValue = Cookies.get("myList");
    const parsedList = cookieValue ? JSON.parse(cookieValue) : [];
    setMyList(parsedList);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData);
  };

  const addItem = () => {
    const id = myList.length + 1;
    const { product, price, amount } = formData;
    if (product && price && amount) {
      // Check if all fields are filled
      const newRow = { id, product, price, amount: parseInt(amount, 10) };
      const updatedList = [...myList, newRow];
      setMyList(updatedList);
      Cookies.set("myList", JSON.stringify(updatedList), { expires: 7 });
      // Clear the form after adding an item
      setFormData({ product: "", price: "", amount: "1" });
    }
  };

  const removeItem = (id) => {
    const updatedList = myList.filter((item) => item.id !== id);
    setMyList(updatedList);
    Cookies.set("myList", JSON.stringify(updatedList), { expires: 7 });
  };

  const deleteAllItems = () => {
    setMyList([]);
    Cookies.remove("myList");
  };

  useEffect(() => {
    // Calculate and update the total sum whenever myList changes
    const sum = myList.reduce((acc, row) => acc + row.price * row.amount, 0);
    //const sum2 = myList.length;
    setTotalSum(sum);
    setTotalProds(myList.length);
    //setTotalProds(sum2);
  }, [myList]);

  const handleAddButtonClick = (itemId) => {
    // Do something with the itemId,
    console.log(`Item with ID ${itemId} added`);
    {
      ListarInformacion.filter((item) => item.id == itemId).map((item) =>
        setFormData({ product: item.name, price: item.price, amount: "1" })
      );
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    console.log("You clicked submit.");
    console.log(formData);
    addItem();
  }

  const updateAmount = (id, increment) => {
    const updatedList = myList.map((item) => {
      if (item.id === id) {
        const newAmount = increment ? item.amount + 1 : item.amount - 1;
        const amount = newAmount >= 1 ? newAmount : 1;
        return {
          ...item,
          amount,
          //amount: increment ? item.amount += 1 : item.amount -= 1,
        };
      }
      return item;
    });
    setMyList(updatedList);
    Cookies.set("myList", JSON.stringify(updatedList), { expires: 7 });
  };

  const [receipt, setReceipt] = useState([]);
  const [receipttotal, setReceipttotal] = useState(0);
  const Copiarcookie = () => {
    setReceipt(myList.concat());
    setReceipttotal(totalSum.toFixed(2));
  };
  useEffect(() => {
    Copiarcookie();
  }, [props.invoiceAndQuote]);
  useEffect(() => {
    if (props.paidIndicator) {
      postfactura();
      deleteAllItems();
    }
  }, [props.paidIndicator]);

  const postfactura = (event) => {
    axios
      .post("http://localhost:3030/users", {
        fecha: new Date().toLocaleString(),
        amount: totalProds,
        total: totalSum.toFixed(2),
        myList,
      })
      .then((res) => {});
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_xsb90h8', 'template_uxnkay6', e.target, 'ELmY-b-ZQDw2QPqIx')
      .then(
        (result) => {
          console.log('Email sent successfully:', result.text);
        },
        (error) => {
          console.error('Email sending failed:', error.text);
        }
      );
  };

  function formatMyList(myList) {
    if (myList.length === 0) {
      return 'No items in the list.';
    }
  
    const formattedList = myList.map((item, index) => {
      return `${item.amount} x  ${item.product}  $${item.price}`;
    });
  
    return formattedList.join('\n');
  }

  return (
    <div className="dark:text-white flex justify-center grid grid-cols-1 divide-y pl-60">

<form onSubmit={sendEmail}>

      <input className="dark:text-black" type="email" name="user_email" />
      <input
        className="dark:text-black"
        type="hidden"
        name="message"
        value={'--------------------------------------------\n|Qty|   |Item|   |Precio|'+`
        --------------------------------------------
        ${formatMyList(myList)}
        --------------------------------------------
        Total: $${totalSum.toFixed(2)}
        --------------------------------------------
        Registrado: ${new Date().toLocaleString()}`}
      />
      <input
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        type="submit"
        value="Enviar por correo"
      />
    </form>

    <hr />
      <table>
        <thead>
          <tr className="px-4 py-2 text-lg">
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {myList.map((row) => (
            <tr className="text-center" key={row.id}>
              <td>{row.product}</td>
              <td>${row.price}</td>

              <div className="flex justify-center items-center">
                <button
                  onClick={() => updateAmount(row.id, false)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full mr-2"
                >
                  -
                </button>
                <td>{row.amount}</td>
                <button
                  onClick={() => updateAmount(row.id, true)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full ml-2"
                >
                  +
                </button>
              </div>

              <td>
                <button
                  onClick={() => removeItem(row.id)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      Total: ${totalSum.toFixed(2)}
      <GetAccount passUpUserInfo={props.acceptUserInfo} />
      {props.userInfo && (
        <DisplayAccount
          passUpInvoice={props.acceptInvoiceAndQuote}
          userInfo={props.userInfo}
          totalSum={totalSum.toFixed(2)}
        />
      )}
      {props.invoiceAndQuote && (
        <QRCard invoiceAndQuote={props.invoiceAndQuote} />
      )}
      {props.paidIndicator && (
        <>
          {" "}
          <div id="invoice-POS">
            <center id="top">
              <div class="logo"></div>
              <div class="info">
                <h2>Sivar POS</h2>
              </div>
            </center>

            <div id="mid">
              <div class="info">
                <p>
                  Col San Benito #759
                  <br />
                  Tel: 22577777
                  <br />
                </p>
              </div>
            </div>

            <div id="bot">
              <div id="table">
                <table>
                  <tr className="tabletitle">
                    <td className="item">
                      <h2>Item</h2>
                    </td>
                    <td className="Hours">
                      <h2>Qty</h2>
                    </td>
                    <td className="Rate">
                      <h2>Precio</h2>
                    </td>
                  </tr>

                  {receipt.map((row) => (
                    <tr class="service">
                      <td className="tableitem">
                        <p className="itemtext">{row.product}</p>
                      </td>
                      <td className="tableitem">
                        <p className="itemtext">{row.amount}</p>
                      </td>
                      <td className="tableitem">
                        <p className="itemtext">${row.price}</p>
                      </td>
                    </tr>
                  ))}

                  <tr className="tabletitle">
                    <td></td>
                    <td className="Rate">
                      <h2>IVA</h2>
                    </td>
                    <td className="payment">
                      <h2></h2>
                    </td>
                  </tr>

                  <tr className="tabletitle">
                    <td></td>
                    <td className="Rate">
                      <h2>Total</h2>
                    </td>
                    <td className="payment">
                      <h2>${receipttotal}</h2>
                    </td>
                  </tr>
                </table>
              </div>

              <div id="legalcopy">
                <p className="legal">
                  <strong>Gracias por su compra!</strong>
                  Esta factura es con fines ilustrativos, como referecia de lo
                  que se almacena en factura electronica.
                </p>
              </div>
            </div>
          </div>{" "}
        </>
      )}
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from "react";
import { GrAdd } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";
import { VscSaveAs } from "react-icons/vsc";
import { AiFillDelete } from "react-icons/ai";
import { GiCancel } from "react-icons/gi";

import DataTable from "react-data-table-component";

const Productos = (props) => {
  const estadoInicialProductos = {
    id: "",
    name: "",
    description: "",
    stock: "",
    expirationDate: "",
    price: "",
    url: "",
  };

  const [producto, setProducto] = useState(estadoInicialProductos);
  const [ListarInformacion, setListarInformacion] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [data, setData] = useState([]);

  // Estado para los campos de edición de productos individuales
  const [editingProduct, setEditingProduct] = useState({
    id: "",
    name: "",
    description: "",
    stock: "",
    expirationDate: "",
    price: "",
    url: "",
  });

  const registrarInformacion = async (e) => {
    e.preventDefault();
    console.log(producto);

    try {
      const result = await props.contractProductos.methods
        .addProduct(
          producto.name,
          producto.description,
          producto.stock,
          producto.expirationDate,
          producto.price,
          producto.url
        )
        .send({ from: props.account });
      console.log(result);
      setProducto(estadoInicialProductos);
      ListarRegistros();
    } catch (error) {
      console.error(error);
    }
  };

  const ManejarFormulario = ({ target: { name, value } }) => {
    console.log(name, value);
    setProducto({ ...producto, [name]: value });
  };

  const ListarRegistros = async () => {
    if (props.contractProductos) {
      try {
        const Counter = await props.contractProductos.methods
          .productCount()
          .call();

        let arrayTarea = [];

        for (let i = 0; i <= Counter; i++) {
          const infotarea = await props.contractProductos.methods
            .products(i)
            .call();
          if (infotarea) {
            const tarea = {
              id: infotarea.id,
              name: infotarea.name,
              price: infotarea.price,
              description: infotarea.description,
              stock: infotarea.stock,
              expirationDate: infotarea.expirationDate,
              url: infotarea.url,
            };
            if(tarea.id !== "0"){
              arrayTarea.push(tarea);
            }
          }
        }
        setListarInformacion(arrayTarea);
        setData(arrayTarea);
        console.log(arrayTarea);
      } catch (error) {
        console.error("Error al actualizar valor:", error);
      }
    }
  };

  const onEdit = (productId) => {
    setEditingProductId(productId);

    // Inicializa el estado de edición del producto individual
    const productToEdit = ListarInformacion.find(
      (item) => item.id === productId
    );
    if (productToEdit) {
      setEditingProduct(productToEdit);
    }
  };

  const onSaveEdit = async () => {
    if (
      !editingProduct ||
      !editingProduct.id ||
      !editingProduct.name ||
      !editingProduct.description ||
      !editingProduct.stock ||
      !editingProduct.expirationDate ||
      !editingProduct.price ||
      !editingProduct.url
    ) {
      console.error("Los detalles del producto son inválidos.");
      return;
    }

    try {
      const result = await props.contractProductos.methods
        .editProduct(
          editingProduct.id,
          editingProduct.name,
          editingProduct.description,
          editingProduct.stock,
          editingProduct.expirationDate,
          editingProduct.price,
          editingProduct.url
        )
        .send({ from: props.account });

      console.log(result);
      setEditingProductId(null);
      ListarRegistros();
    } catch (error) {
      console.error("Error al editar el producto:", error);
    }
  };

  const onCancelEdit = () => {
    setEditingProductId(null);
  };

  const onDeleteProduct = async (productId) => {
    try {
      const result = await props.contractProductos.methods
        .deleteProduct(productId)
        .send({ from: props.account });

      console.log(result);
      ListarRegistros();
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const toggleExpirationDate = () => {
    // Esta función debe cambiar el valor de producto.expirationDate
    // según la selección del usuario
    if (producto.expirationDate !== "No aplica") {
      setProducto({ ...producto, expirationDate: "No aplica" });
    } else {
      // Puedes establecer un valor inicial si lo deseas
      setProducto({ ...producto, expirationDate: "" });
    }
  };
  

  useEffect(() => {
    ListarRegistros();
  }, [props.contractProductos]);

  const columnListarProductos = [
    {
      name: "NOMBRE",
      width: "210px",
      selector: (row) => (
        <div>
          {editingProductId === row.id ? (
            <input
              className="w-full p-2 text-lg text-black border border-gray-300"
              type="text"
              name="name"
              value={editingProduct.name}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  name: e.target.value,
                })
              }
            />
          ) : (
            <b>{row.name}</b>
          )}
        </div>
      ),
    },
    {
      name: "DESCRIPCION",
      width: "210px",
      selector: (row) => (
        <div>
          {editingProductId === row.id ? (
            <input
              className="w-full p-2 text-lg text-black border border-gray-300"
              type="text"
              name="description"
              value={editingProduct.description}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  description: e.target.value,
                })
              }
            />
          ) : (
            row.description
          )}
        </div>
      ),
    },
    {
      name: "EXISTENCIAS",
      width: "157px",
      selector: (row) => (
        <div className="">
          {editingProductId === row.id ? (
            <input
              className="w-full p-2 text-lg text-black border border-gray-300"
              type="text"
              name="stock"
              value={editingProduct.stock}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  stock: e.target.value,
                })
              }
            />
          ) : (
            row.stock
          )}
        </div>
      ),
    },
    {
      name: "CADUCIDAD",
      width: "210px",
      selector: (row) => (
        <div>
          {editingProductId === row.id ? (
            <input
              className="w-full p-2 text-lg text-black border border-gray-300"
              type="date"
              name="expirationDate"
              value={editingProduct.expirationDate}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  expirationDate: e.target.value,
                })
              }
            />
          ) : (
            row.expirationDate
          )}
        </div>
      ),
    },
    {
      name: "PRECIO",
      width: "210px",
      selector: (row) => (
        <div>
          {editingProductId === row.id ? (
            <input
              className="w-full p-2 text-lg text-black border border-gray-300"
              type="text"
              name="price"
              value={editingProduct.price}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  price: e.target.value,
                })
              }
            />
          ) : (
            <>${row.price}</>
          )}
        </div>
      ),
    },
    {
      name: "IMAGEN URL",
      width: "210px",
      selector: (row) => (
        <div>
          {editingProductId === row.id ? (
            <input
              className="w-full p-2 text-lg text-black border border-gray-300"
              type="text"
              name="url"
              value={editingProduct.url}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  url: e.target.value,
                })
              }
            />
          ) : (
            row.url.slice(0, 25)
          )}
        </div>
      ),
    },
    {
      name: "EDITAR",
      width: "190px",
      selector: (row) => <div className="p-4">
        {editingProductId === row.id ? (  
        <>
          <button
            className="mr-4 bg-[#4CAF50] rounded-[10px] p-2 text-4xl text-black"
            onClick={onSaveEdit}
          >
            <VscSaveAs />
          </button>
          <button
            className=" bg-red-500 rounded-[10px] p-2 text-4xl text-black"
            onClick={onCancelEdit}
          >
            <GiCancel />
          </button>
        </>
      ) : (
        <button
          className="mr-2 bg-[#FFD658] rounded-[10px] p-2 text-4xl text-black"
          onClick={() => onEdit(row.id)}
        >
          <FaEdit />
        </button>
      )}
      </div>
    },
    {
      name: "ELIMINAR",
      width: "187px",
      selector: (row) => (
        <div>
          <button
            className=" bg-red-500 rounded-[10px] p-2 text-4xl text-black"
            onClick={() => onDeleteProduct(row.id)}
          >
            <AiFillDelete />
          </button>
        </div>
      ),
    },
  ];
  const columnsRegistrarProductos = [
    {
      name: "NOMBRE",
      width: "210px",
      selector: (row) => <b>{row.name}</b>
    },
    {
      name: "DESCRIPCION",
      width: "210px",
      selector: (row) => <b>{row.description}</b>
    },
    {
      name: "EXISTENCIAS",
      width: "210px",
      selector: (row) => <b>{row.stock}</b>
    },
    {
      name: "CADUCIDAD",
      width: "225px",
      selector: (row) => <b>{row.expirationDate}</b>
    },
    {
      name: "PRECIO",
      width: "205px",
      selector: (row) => <b>{row.price}</b>
    },
    {
      name: "IMAGEN URL",
      width: "250px",
      selector: (row) => <b>{row.url}</b>
    },
    {
      name: "AGREGAR",
      width: "15.2em",
      selector: (row) => <div className="text-black"><b>{row.addProduct}</b></div>
    },
  ];

  const dataRegistrarProductos = [
    {
        name: <div>
          <input
            type="text"
            id="name"
            name="name"
            onChange={ManejarFormulario}
            value={producto.name}
            className="dark:bg-gray-600 w-full p-2 text-lg border border-gray-300"
          />
        </div>,
        description: <div>
          <input
            type="text"
            id="description"
            name="description"
            onChange={ManejarFormulario}
            value={producto.description}
            className="dark:bg-gray-600 w-full p-2 text-lg border border-gray-300"
          />
        </div>,
        stock: <div>
          <input
            type="number"
            id="stock"
            name="stock"
            onChange={ManejarFormulario}
            value={producto.stock}
            className="dark:bg-gray-600 w-full p-2 text-lg border border-gray-300"
          />
        </div>,
        expirationDate: <div className="w-auto dark:text-white">
        <label>
          <input
            type="checkbox"
            name="expirationDateApplies"
            checked={producto.expirationDate !== "No aplica"}
            onChange={toggleExpirationDate}
            className="mx-2"
          />
          Aplica
        </label>
        <label>
          <input
            type="checkbox"
            name="expirationDateDoesNotApply"
            checked={producto.expirationDate === "No aplica"}
            onChange={toggleExpirationDate}
            className="mx-2"
          />
          No Aplica
        </label>
      {producto.expirationDate !== "No aplica" ? (
        <div>
          <input
            type="date"
            id="expirationDate"
            name="expirationDate"
            onChange={ManejarFormulario}
            value={producto.expirationDate}
            className="dark:bg-gray-600 w-full text-lg p-2 border border-gray-300 text-black my-2"
          />
        </div>
      ) : (
        <></>
      )}
      </div>
      ,
        price: <div>
          <input
            type="number"
            id="price"
            name="price"
            onChange={ManejarFormulario}
            value={producto.price}
            className="dark:bg-gray-600 w-full p-2 text-lg border border-gray-300"
          />
        </div>,
        url: <div>
          <input
            type="string"
            id="url"
            name="url"
            onChange={ManejarFormulario}
            value={producto.url}
            className="dark:bg-gray-600 w-full p-2 text-lg border border-gray-300"
          />
        </div>,
        addProduct: <div className="p-3">
          <button
            className="mx-16 my-4 block bg-[#FFD658] rounded-[10px] p-4 text-xl font-sans font-medium"
            type="submit"
          >
            <GrAdd />
          </button>
        </div>,
    },
]

  return (
    

<div className="flex grid justify-center grid-cols-1 divide-y dark:text-white pl-48">
      <form onSubmit={registrarInformacion}>
        <DataTable columns={columnsRegistrarProductos} data={dataRegistrarProductos} responsive />
      </form>

      
      <DataTable columns={columnListarProductos} data={data} pagination responsive />
    </div>


   
    
  );
};

export default Productos;
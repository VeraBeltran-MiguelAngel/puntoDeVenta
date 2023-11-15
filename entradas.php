<?php
// Incluye el archivo de conexión (dentro del server el archivo productos.php 
//debe salir dos carpetas afuera para llegar a la carpeta conPrincipal)
require('../../conPrincipal/index.php');


if (isset($_GET["resgistraEntrada"])) {
    $data = json_decode(file_get_contents("php://input"));

    $idGym = $data->idGym;
    $idProductos = $data->idProducto;
    $idProveedor = $data->idProveedor;
    $idUsuario = $data->idUsuario;
    $fechaEntrada = $data->fechaEntrada;
    $cantidad = $data->cantidad;
    $precioCompra = $data->precioCompra;

    // Consulta preparada
    $insertEntrada = "INSERT INTO entradas
    (Gimnasio_idGimnasio, Producto_idProducto, Proveedor_idProveedor, Usuarios_idUsuarios, fechaEntrada, cantidad, precioCompra)
    VALUES (?, ?, ?, ?, ?, ?, ?)";

    // Preparar la consulta
    $stmt = mysqli_prepare($conexionBD, $insertEntrada);

    // Vincular parámetros
    mysqli_stmt_bind_param($stmt, "iiissid", $idGym, $idProducto, $idProveedor, $idUsuario, $fechaEntrada, $cantidad, $precioCompra);

    // Ejecutar la consulta
    $result = mysqli_stmt_execute($stmt);

    // Verificar si la consulta se ejecutó correctamente
    if ($result) {
        echo json_encode(["success" => 1]);
    } else {
        // Manejo de errores
        echo json_encode(["algo salio mal" => 0, "error" => mysqli_error($conexionBD)]);
    }

    // Cerrar la consulta preparada
    mysqli_stmt_close($stmt);

    exit();
}

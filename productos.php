<?php

// Incluye el archivo de conexión (dentro del server el archivo productos.php 
//debe salir dos carpetas afuera para llegar a la carpeta conPrincipal)
require('../../conPrincipal/index.php');


if (isset($_GET["listaProductosRecepcion"])) {
    // Consulta todos los registros de la tabla productos
    //esta consulta solo es para el recepcionista(punto de venta)
    $consultaProductos = "SELECT p.idProducto as 'id', c.nombre as 'categoria', p.nombre, p.tamaño, p.descripcion, p.precio, p.cantidad
            FROM producto p
            INNER JOIN categoria c ON c.idCategoria = p.Categoria_idCategoria";

    // echo $consultaProductos;


    $sqlData = mysqli_query($conexionBD, $consultaProductos);

    if ($sqlData) {
        if (mysqli_num_rows($sqlData) > 0) {
            $productos = mysqli_fetch_all($sqlData, MYSQLI_ASSOC);
            // Realiza casting explícito a enteros
            foreach ($productos as &$producto) {
                $producto['id'] = (int)$producto['id'];
                $producto['precio'] = (float)$producto['precio'];
                $producto['cantidad'] = (int)$producto['cantidad'];
            }

            echo json_encode($productos);
        } else {
            echo json_encode([["success" => 0]]);
        }
    } else {
        // Manejo de errores
        echo "Error en la consulta: " . mysqli_error($conexionBD);
    }
}


// Consulta datos y recepciona una clave para consultar dichos datos con dicha clave
if (isset($_GET["listaProductosAdmin"])) {

    $consultaProductosAdmin = "SELECT p.idProducto, p.nombre, p.tamaño, p.descripcion, 
    p.precio as 'precio de venta', p.estatus, c.nombre as 'categoria'
    FROM producto p
    INNER JOIN categoria c ON c.idCategoria = p.Categoria_idCategoria;";

    // echo $consultaProductosAdmin;

    $sqlData = mysqli_query($conexionBD, $consultaProductosAdmin);

    if (mysqli_num_rows($sqlData) > 0) {
        $productosAdmin = mysqli_fetch_all($sqlData, MYSQLI_ASSOC);
        // Realiza casting explícito a enteros
        foreach ($productosAdmin as &$producto) {
            $producto['idProducto'] = (int)$producto['idProducto'];
            $producto['precio de venta'] = (float)$producto['precio de venta'];
            $producto['estatus'] = (int)$producto['estatus'];
        }
        echo json_encode($productosAdmin);
        exit();
    } else {
        echo json_encode(["success" => 0]);
    }
}

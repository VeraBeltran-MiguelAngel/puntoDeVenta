<?php
session_start();
// Incluye el archivo de conexión (dentro del server el archivo productos.php 
//debe salir dos carpetas afuera para llegar a la carpeta conPrincipal)
require('../../conPrincipal/index.php');

if (isset($_GET["listaProductosRecepcion"])) {

    // Obtener Gimnasio_idGimnasio de la respuesta JSON del inicio de sesión
    $gimnasioId = isset($_SESSION['gimnasioId']) ? $_SESSION['gimnasioId'] : null;


    // Obtener Gimnasio_idGimnasio del parámetro de la solicitud(viene desde angular en metodo obternerProductos del servicio ProductosService)
    // $gimnasioId = isset($_GET['gimnasioId']) ? $_GET['gimnasioId'] : null;

    if (!$gimnasioId) {
        // Manejar el caso en el que no se obtuvo Gimnasio_idGimnasio
        http_response_code(401);
        echo json_encode(["message" => "No se pudo obtener el gimnasioId"]);
        exit;
    } else {
        // echo $_SESSION['gimnasioId'];
        switch ($gimnasioId) {
            case 1:
                $consultaProductos = "SELECT * FROM vistaproductosenventagim1recep";
                break;
            case 2:
                $consultaProductos = "SELECT * FROM vistaproductosenventagim2recep";
                break;
        }

        // echo $consultaProductos;

        $sqlData = mysqli_query($conexionBD, $consultaProductos);

        if ($sqlData) {
            if (mysqli_num_rows($sqlData) > 0) {
                $productos = mysqli_fetch_all($sqlData, MYSQLI_ASSOC);
                // Realiza casting explícito a enteros
                foreach ($productos as &$producto) {
                    $producto['precio'] = (float)$producto['precio'];
                    $producto['cantidad'] = (int)$producto['cantidad'];
                }

                echo json_encode($productos, JSON_UNESCAPED_UNICODE); // evita errores de ñ o acentos
            } else {
                echo json_encode([["success" => 0]]);
            }
        } else {
            // Manejo de errores
            echo "Error en la consulta: " . mysqli_error($conexionBD);
        }
    }
}

// Consultar los productos de la franquicia para mostrarlos al admin
if (isset($_GET["listaProductosAdmin"])) {

    $consultaProductosAdmin = "SELECT
        p.codigoBarra AS 'codigo_de_barra',
        p.nombre,
        p.descripcion,
        p.precio AS 'precio de venta',
        p.estatus,
        c.nombre AS 'categoria'
    FROM
        producto p
    INNER JOIN categoria c ON
    c.idCategoria = p.Categoria_idCategoria";

    // echo $consultaProductosAdmin;

    $sqlData = mysqli_query($conexionBD, $consultaProductosAdmin);

    if (mysqli_num_rows($sqlData) > 0) {
        $productosAdmin = mysqli_fetch_all($sqlData, MYSQLI_ASSOC);
        // Realiza casting explícito a enteros
        foreach ($productosAdmin as &$producto) {
            $producto['precio de venta'] = (float)$producto['precio de venta'];
        }
        echo json_encode($productosAdmin, JSON_UNESCAPED_UNICODE);
        exit();
    } else {
        echo json_encode(["success" => 0]);
    }
}

// consultar el inventario dependiendo de la sucursal
if (isset($_GET["listaInventario"])) {
    // Obtener Gimnasio_idGimnasio de la respuesta JSON del inicio de sesión
    $gimnasioId = isset($_SESSION['gimnasioId']) ? $_SESSION['gimnasioId'] : null;

    if (!$gimnasioId) {
        // Manejar el caso en el que no se obtuvo Gimnasio_idGimnasio
        http_response_code(401);
        echo json_encode(["message" => "No se pudo obtener el gimnasioId"]);
        exit;
    } else {
        // echo $_SESSION['gimnasioId'];
        switch ($gimnasioId) {
            case 1:
                $consultaProductos = "SELECT * FROM vistaInventarioGim1";
                break;
            case 2:
                $consultaProductos = "SELECT * FROM vistaInventarioGim2";
                break;
        }

        // echo $consultaProductos;

        $sqlData = mysqli_query($conexionBD, $consultaProductos);

        if ($sqlData) {
            if (mysqli_num_rows($sqlData) > 0) {
                $productos = mysqli_fetch_all($sqlData, MYSQLI_ASSOC);
                // Realiza casting explícito a enteros
                foreach ($productos as &$producto) {
                    $producto['precio de venta'] = (float)$producto['precio de venta'];
                    $producto['cantidad disponible'] = (int)$producto['cantidad disponible'];
                }

                echo json_encode($productos, JSON_UNESCAPED_UNICODE); // evita errores de ñ o acentos
            } else {
                echo json_encode([["success" => 0]]);
            }
        } else {
            // Manejo de errores
            echo "Error en la consulta: " . mysqli_error($conexionBD);
        }
    }
}


if (isset($_GET["inventarioGlobal"])) {

    $inventarioGlobal = "SELECT * FROM vistaInventarioGlobal";


    $sqlData = mysqli_query($conexionBD, $inventarioGlobal);


    if (mysqli_num_rows($sqlData) > 0) {
        $inventario = mysqli_fetch_all($sqlData, MYSQLI_ASSOC);

        echo json_encode($inventario);
        exit();
    } else {
        echo json_encode(["success" => 0]);
    }
}

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
                    $producto['id'] = (int)$producto['id'];
                    $producto['precio'] = (float)$producto['precio'];
                    $producto['cantidad'] = (int)$producto['cantidad'];
                }

                echo json_encode($productos, JSON_UNESCAPED_UNICODE);
            } else {
                echo json_encode([["success" => 0]]);
            }
        } else {
            // Manejo de errores
            echo "Error en la consulta: " . mysqli_error($conexionBD);
        }
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
        }
        echo json_encode($productosAdmin, JSON_UNESCAPED_UNICODE);
        exit();
    } else {
        echo json_encode(["success" => 0]);
    }
}

<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET,POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE, PATCH");
    header("Access-Control-Allow-Headers: Content-Type");
    exit;
}

// Conecta a la base de datos  con usuario, contraseña y nombre de la BD
$servidor = "localhost:3306";
$usuario = "olympus";
$contrasenia = "wLbLYCRckNzK2yk0";
$nombreBaseDatos = "olympus";
$conexionBD = new mysqli($servidor, $usuario, $contrasenia, $nombreBaseDatos);

// Consulta todos los registros de la tabla productos
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

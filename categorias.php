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
$usuario = "root";
$contrasenia = "Kindred1222.";
$nombreBaseDatos = "olympusproduc";
$conexionBD = new mysqli($servidor, $usuario, $contrasenia, $nombreBaseDatos);

// Consulta todos los registros de la tabla productos
$consultaCategorias = "SELECT * FROM categoria";

//  echo $consultaCategorias;


$sqlData = mysqli_query($conexionBD, $consultaCategorias);

if ($sqlData) {
    if (mysqli_num_rows($sqlData) > 0) {
        $categorias = mysqli_fetch_all($sqlData, MYSQLI_ASSOC);
        // Realiza casting explícito a enteros
        foreach ($categorias as &$cat) {
            $cat['idCategoria'] = (int)$cat['idCategoria'];
            $cat['estatus'] = (int)$cat['estatus'];
        }

        echo json_encode($categorias);
    } else {
        echo json_encode([["success" => 0]]);
    }
} else {
    // Manejo de errores
    echo "Error en la consulta: " . mysqli_error($conexionBD);
}

<?php
// Incluye el archivo de conexión (dentro del server el archivo productos.php 
//debe salir dos carpetas afuera para llegar a la carpeta conPrincipal)
require('../../conPrincipal/index.php');

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

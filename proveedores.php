<?php


// Incluye el archivo de conexión (dentro del server el archivo productos.php 
//debe salir dos carpetas afuera para llegar a la carpeta conPrincipal)
require('../../conPrincipal/index.php');

// Consulta todos los registros de la tabla productos
$consultaProveedores= "SELECT idProveedor,nombre,apPaterno as 'apellido paterno', apMaterno as 'apellido materno',razonSocial as 'razon social', telefono FROM proveedor";

//  echo $consultaProveedores;


$sqlData = mysqli_query($conexionBD, $consultaProveedores);

if ($sqlData) {
    if (mysqli_num_rows($sqlData) > 0) {
        $proveedores = mysqli_fetch_all($sqlData, MYSQLI_ASSOC);
        // Realiza casting explícito a enteros
        foreach ($proveedores as &$prov) {
            $prov['idProveedor'] = (int)$prov['idProveedor'];
        }

        echo json_encode($proveedores);
    } else {
        echo json_encode([["success" => 0]]);
    }
} else {
    // Manejo de errores
    echo "Error en la consulta: " . mysqli_error($conexionBD);
}

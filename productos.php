<?php

// Incluye el archivo de conexión (dentro del server el archivo productos.php 
//debe salir dos carpetas afuera para llegar a la carpeta conPrincipal)
require('../../conPrincipal/index.php');

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

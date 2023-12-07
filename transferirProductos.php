<?php
session_start();
// Incluye el archivo de conexión (dentro del server el archivo productos.php 
//debe salir dos carpetas afuera para llegar a la carpeta conPrincipal)
require('../../conPrincipal/index.php');

/**
 * En este metodo recibimos dos objetos 1 para crear el registro en tabla transferencia
 * y el otro con la lista de productos que van a pertenecer a esa transferencia
 */
if (isset($_GET["transferirPro"])) {
    try {

        // Obtén los datos del cuerpo de la solicitud POST
        $jsonData = file_get_contents('php://input');
        // Decodifica los datos JSON en un array asociativo
        $data = json_decode($jsonData, true);

        // Verifica si los datos esperados están presentes
        if (isset($data['transferencia']) && isset($data['productosParaTransferir'])) {
            // Accede a los datos individualmente
            $transferencia = $data['transferencia'];
            $productosParaTransferir = $data['productosParaTransferir'];

            //alamacenar los valores del array asociativo (transferencia) individualmente
            $idGymOrigen = $transferencia['idGymOrigen'];
            $idGymDestino = $transferencia['idGimnasio'];
            $idUsuario = $transferencia['idUsuario'];
            $fechaEnvio = $transferencia['fechaEnvio'];
            $totalTransferencia = $transferencia['total'];
            $folio = $transferencia['folio'];


            $insertTrans = "INSERT INTO transferencias
        (`GimOrigen_idGimnasio`, `GimDestino_idGimnasio`, `Usuarios_idUsuarios`, `fechaEnvio`, `total` ,`folio`) 
        VALUES (?,?,?,?,?,?);";

            // Preparar la consulta
            $stmt = mysqli_prepare($conexionBD, $insertTrans);
            if (!$stmt) {
                throw new Exception("Error al preparar la insercion de transferencia: " . mysqli_error($conexionBD));
            }
            // Vincular parámetros (especificar tipo de dato integer =i)
            mysqli_stmt_bind_param($stmt, "iiisds", $idGymOrigen, $idGymDestino, $idUsuario, $fechaEnvio, $totalTransferencia, $folio);
            // Ejecutar la consulta (tabla padre)
            $result = mysqli_stmt_execute($stmt);

            // Verificar si se creo el registro padre
            if ($result) {
                //obtener el idTransferencia
                $consultaIdTransferencia = "SELECT idTransferencias 
            from transferencias where folio = ?";
                // Preparar la consulta
                $stmtId = mysqli_prepare($conexionBD, $consultaIdTransferencia);
                // Vincular parámetros
                mysqli_stmt_bind_param($stmtId, "s", $folio);
                // Ejecutar la consulta
                $resultE = mysqli_stmt_execute($stmtId);
                // Obtener el idTransferencias después de ejecutar la consulta
                mysqli_stmt_store_result($stmtId);
                // Vincular el resultado a una variable
                mysqli_stmt_bind_result($stmtId, $idTransferencias);
                // Obtener el valor
                mysqli_stmt_fetch($stmtId);
                // Cerrar la consulta preparada
                mysqli_stmt_close($stmtId);

                // Insertar los productos de $productosParaTransferir
                foreach ($productosParaTransferir as $producto) {
                    $idProducto = $producto['id'];
                    $nombreProducto = $producto['nombre'];
                    $cantidadTransferida = $producto['cantidad'];
                    $precioUnitario = $producto['precio'];
                    $importe = $cantidadTransferida * $precioUnitario;

                    $insertarProducto = "INSERT INTO detalle_transferencia
                (`Transferencias_idTransferencias`, `GimDestino`, `Producto_idProducto`, `nombreProducto`, `cantidadTransferida`, `precioUnitario`, `importe`) 
                VALUES (?, ?, ?, ?, ?, ?,?)";

                    $stmtProducto = mysqli_prepare($conexionBD, $insertarProducto);
                    if (!$stmtProducto) {
                        throw new Exception("Error al preparar la insercion del producto: " . mysqli_error($conexionBD));
                    }

                    if ($stmtProducto) {
                        // Vincular parámetros (especificar tipo de dato integer =i y double =d)
                        mysqli_stmt_bind_param(
                            $stmtProducto,
                            "iiisidd",
                            $idTransferencias,
                            $idGymDestino,
                            $idProducto,
                            $nombreProducto,
                            $cantidadTransferida,
                            $precioUnitario,
                            $importe
                        );
                        $resultProducto = mysqli_stmt_execute($stmtProducto);

                        if (!$resultProducto) {
                            throw new Exception("Error al insertar productos: " . mysqli_error($conexionBD));
                        }
                        mysqli_stmt_close($stmtProducto);
                    } else {
                        // Manejo de errores
                        http_response_code(500);  // Código de estado HTTP para "Error interno del servidor"
                        echo json_encode(["success" => false, "message" => "Error al preparar la consulta del producto: " . mysqli_error($conexionBD)]);
                        exit;
                    }
                }

                echo json_encode(["success" => true, "message" => "Transferencia registrada correctamente"]);
            } else {
                throw new Exception("Error al registrar la transferencia, valida que los datos ingresados sean correctos");
            }
            // Cerrar la consulta preparada
            mysqli_stmt_close($stmt);
            exit();
        } else {
            // Manejo de error si no se reciben los datos esperados
            echo json_encode(["success" => false, "message" => "Datos incompletos o incorrectos"]);
        }
    } catch (Exception $e) {
        http_response_code(500);  // Código de estado HTTP para "Error interno del servidor"
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}

/**
 * Mostrar transfrencias pendientes de validacion
 */
if (isset($_GET["transferenciasSinValidar"])) {
    // Obtener Gimnasio_idGimnasio de la respuesta JSON del inicio de sesión
    $gimnasioId = isset($_SESSION['gimnasioId']) ? $_SESSION['gimnasioId'] : null;
    try {
        //code...
    } catch (Exception $e) {
        http_response_code(500);  // Código de estado HTTP para "Error interno del servidor"
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}

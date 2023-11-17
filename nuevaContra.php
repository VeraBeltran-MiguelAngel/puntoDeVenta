<?php
// Incluye el archivo de conexión (dentro del server el archivo productos.php 
//debe salir dos carpetas afuera para llegar a la carpeta conPrincipal)
require('../../conPrincipal/index.php');

if (isset($_GET["solicitaNuevaPass"])) {
    // echo 'Hola estamos validando tus datos';
    $data = json_decode(file_get_contents("php://input"));

    $token ='ABCD123';
    $username = $data->username;

    $updatePass="UPDATE Usuarios SET token = ?, resetPassword = 1 WHERE email = ?";

    // echo $consultaRol;
    $stmt = mysqli_prepare($conexionBD, $updatePass);
     // Vincular parámetros
    mysqli_stmt_bind_param($stmt, "te", $token,$username);
    // Ejecutar la consulta
    $result = mysqli_stmt_execute($stmt);


    // Verificar si la consulta se ejecutó correctamente
    if ($result) {
        echo json_encode(["success" => true, "message" => "Link enviado"]);
    } else {
        http_response_code(401);  // Código de estado HTTP para "Error interno del servidor"
        echo json_encode(["success" => false, "message" => "Valida que los datos ingresados sean correctos"]);
    }

    // Cerrar la consulta preparada
    mysqli_stmt_close($stmt);

    exit();

}
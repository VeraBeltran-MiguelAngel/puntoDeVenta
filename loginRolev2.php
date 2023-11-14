<?php
// Incluye el archivo de conexión (dentro del server el archivo productos.php 
//debe salir dos carpetas afuera para llegar a la carpeta conPrincipal)
require('../../conPrincipal/index.php');

if (isset($_GET["credenciales"])) {
    // echo 'Hola estamos validando tus datos';
    $data = json_decode(file_get_contents("php://input"));

    $username = $data->username;
    // $password_hash = password_hash($data->password, PASSWORD_DEFAULT);
    $pass = $data->password;

    // Para verificar la contraseña durante el inicio de sesión
    $consultaRol = "SELECT Usuarios.idUsuarios, Usuarios.email, Usuarios.pass,
    Roles.nombre AS rol,  Usuarios.Gimnasio_idGimnasio as idGym, Gimnasio.nombreGym
    FROM Usuarios 
    INNER JOIN Usuarios_has_Roles ON Usuarios.idUsuarios = Usuarios_has_Roles.Usuarios_idUsuarios 
    INNER JOIN Roles ON Usuarios_has_Roles.Roles_idRoles = Roles.idRoles
    INNER JOIN Gimnasio on Usuarios.Gimnasio_idGimnasio = Gimnasio.idGimnasio 
    WHERE Usuarios.email = ?";

    // echo $consultaRol;
    $stmt = mysqli_prepare($conexionBD, $consultaRol);
    mysqli_stmt_bind_param($stmt, "s", $username);
    mysqli_stmt_execute($stmt);
    $sqlData = mysqli_stmt_get_result($stmt);

    if (mysqli_num_rows($sqlData) > 0) {
        // echo 'exito';
        $userData = mysqli_fetch_all($sqlData, MYSQLI_ASSOC);
        // Accede al valor de 'pass' en la primera fila
        $passFromDatabase = $userData[0]['pass'];
        if (password_verify($pass, $passFromDatabase)) {
            session_start();
            $_SESSION['gimnasioId'] = $userData[0]['idGym'];
            // echo 'contraseña correcta';
            // Contraseña verificada correctamente
            echo json_encode($userData);
            exit;
        }
    }

    http_response_code(401);
    echo json_encode(["message" => "Por favor valida que tus credenciales sean correctas"]);
    exit;


    mysqli_close($conexionBD);
}
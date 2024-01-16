//clase correspondiente al registro de empleado
export class registrarEmpleado {
    nombre!: string;
    apPaterno!: string;
    apMaterno!: string;
    rfc!: string;
    Gimnasio_idGimnasio!: string;
    area!: string;
    turnoLaboral!: string;
    salario!: string;
    email!: string;
    pass!: string;
}

//mensaje retornado despues insertar/
export class msgResult {
    msg!: string;
}

//clase correspondiente al datos traidos para la tabla lista de colaboradores dentro del componente colaboradores
export class listaEmpleados {
    idEmpleado!: string;
    nombre!: string;
    apPaterno!: string;
    apMaterno!: string;
    rfc!: string;
    Gimnasio_idGimnasio!: string;
    turnoLaboral!: string;
    nombreGym!: string;
    salario!: string;
    email!: string;
}
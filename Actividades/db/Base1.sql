-- Código base para una base de datos SQL Server
IF DB_ID(N'Base1') IS NULL
	CREATE DATABASE Base1;
GO

USE Base1;
GO

IF OBJECT_ID(N'dbo.Usuarios', N'U') IS NULL
BEGIN
	CREATE TABLE dbo.Usuarios
	(
		UsuarioId INT IDENTITY(1,1) NOT NULL
			CONSTRAINT PK_Usuarios PRIMARY KEY,
		Nombre NVARCHAR(100) NOT NULL,
		Correo NVARCHAR(255) NOT NULL
			CONSTRAINT UQ_Usuarios_Correo UNIQUE,
		FechaRegistro DATETIME2 NOT NULL
			CONSTRAINT DF_Usuarios_FechaRegistro DEFAULT SYSDATETIME(),
		Activo BIT NOT NULL
			CONSTRAINT DF_Usuarios_Activo DEFAULT 1
	);
END;
GO

IF OBJECT_ID(N'dbo.Categorias', N'U') IS NULL
BEGIN
	CREATE TABLE dbo.Categorias
	(
		CategoriaId INT IDENTITY(1,1) NOT NULL
			CONSTRAINT PK_Categorias PRIMARY KEY,
		Nombre NVARCHAR(100) NOT NULL
			CONSTRAINT UQ_Categorias_Nombre UNIQUE
	);
END;
GO

IF OBJECT_ID(N'dbo.Productos', N'U') IS NULL
BEGIN
	CREATE TABLE dbo.Productos
	(
		ProductoId INT IDENTITY(1,1) NOT NULL
			CONSTRAINT PK_Productos PRIMARY KEY,
		CategoriaId INT NOT NULL,
		Nombre NVARCHAR(150) NOT NULL,
		Precio DECIMAL(10,2) NOT NULL
			CONSTRAINT CK_Productos_Precio CHECK (Precio >= 0),
		Existencia INT NOT NULL
			CONSTRAINT CK_Productos_Existencia CHECK (Existencia >= 0),
		CONSTRAINT FK_Productos_Categorias
			FOREIGN KEY (CategoriaId) REFERENCES dbo.Categorias(CategoriaId)
	);
END;
GO

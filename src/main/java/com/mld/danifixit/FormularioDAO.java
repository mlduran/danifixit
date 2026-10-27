package com.mld.danifixit;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
/**
 *
 * @author miguel
 */
public class FormularioDAO {

    public void insertar(String nombre,
            String email,
            String asunto,
            String mensaje) {

        String sql = "INSERT INTO formulario (nombre, email, asunto, mensaje) VALUES (?, ?, ?, ?)";

        try {
            Connection con = Conexion.getConnection();
            PreparedStatement ps = con.prepareStatement(sql);

            ps.setString(1, nombre);
            ps.setString(2, email);
            ps.setString(3, asunto);
            ps.setString(4, mensaje);

            ps.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public List<FormularioDTO> obtenerTodos() {

        List<FormularioDTO> lista = new ArrayList<>();

        String sql = """
                SELECT id, fecha, nombre, email, asunto, mensaje
                FROM formulario
                ORDER BY fecha DESC
                """;

        try (Connection con = Conexion.getConnection(); PreparedStatement ps = con.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {

                FormularioDTO dto = new FormularioDTO();

                dto.setId(rs.getLong("id"));
                dto.setFecha(rs.getTimestamp("fecha"));
                dto.setNombre(rs.getString("nombre"));
                dto.setEmail(rs.getString("email"));
                dto.setAsunto(rs.getString("asunto"));
                dto.setMensaje(rs.getString("mensaje"));

                lista.add(dto);
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return lista;
    }
}

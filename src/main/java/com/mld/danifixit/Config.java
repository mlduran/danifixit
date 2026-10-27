package com.mld.danifixit;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author miguel
 */
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class Config {

    private static final Properties properties = new Properties();

    static {
        try (InputStream in = Config.class.getClassLoader()
                .getResourceAsStream("config.properties")) {

            if (in == null) {
                throw new RuntimeException("No se encontró config.properties");
            }

            properties.load(in);

        } catch (IOException e) {
            throw new RuntimeException("Error cargando config.properties", e);
        }
    }

    public static String get(String clave) {
        return properties.getProperty(clave);
    }

    public static int getInt(String clave) {
        return Integer.parseInt(properties.getProperty(clave));
    }
}

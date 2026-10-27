/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mld.danifixit;

/**
 *
 * @author miguel
 */
import jakarta.mail.*;
import jakarta.mail.internet.*;
import java.util.Properties;

public class EmailService {



    public static void enviarCorreo(String destinatario,
                                    String asunto,
                                    String cuerpo) throws Exception {

        Properties props = new Properties();

        props.put("mail.smtp.host", Config.get("mail.smtp.host"));
        props.put("mail.smtp.port", Config.get("mail.smtp.port"));
        props.put("mail.smtp.auth", Config.get("mail.smtp.auth"));
        props.put("mail.smtp.starttls.enable", Config.get("mail.smtp.starttls.enable"));
        
        String usuario = Config.get("mail.usuario");
        String password = Config.get("mail.password");
        

        Session session = Session.getInstance(props,
                new Authenticator() {
                    @Override
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(usuario, password);
                    }
                });

        Message mensaje = new MimeMessage(session);

        mensaje.setFrom(new InternetAddress(usuario));
        mensaje.setRecipients(
                Message.RecipientType.TO,
                InternetAddress.parse(destinatario));

        mensaje.setSubject(asunto);

        mensaje.setText(cuerpo);

        Transport.send(mensaje);
    }
}

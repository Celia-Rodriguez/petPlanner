<?php

class User{
    private $idUser;
    private $userName;
    private $password;
    private $email;
    private $photo;
    private $securityQuestion;
    private $securityAnswer;
    private $role;

    // Getters
    public function getIdUser() { return $this->idUser; }
    public function getUserName() { return $this->userName; }
    public function getPassword() { return $this->password; }
    public function getEmail() { return $this->email; }
    public function getPhoto() { return $this->photo; }
    public function getSecurityQuestion() { return $this->securityQuestion; }
    public function getSecurityAnswer() { return $this->securityAnswer; }
    public function getRole() { return $this->role; }

    // Setters
    public function setUserName($userName) { $this->userName = $userName; }
    public function setPassword($password) { $this->password = $password; } 
    public function setEmail($email) { $this->email = $email; }
    public function setPhoto($photo) { $this->photo = $photo; }
    public function setSecurityQuestion($securityQuestion) { $this->securityQuestion = $securityQuestion; }
    public function setSecurityAnswer($securityAnswer) { $this->securityAnswer = $securityAnswer; }
    public function setRole($role) { $this->role = $role; }

    // Constructores
    public function __construct($idUser, $userName, $email, $role) {
        $this->idUser = $idUser;
        $this->userName = $userName;
        $this->email = $email;
        $this->role = $role;
    }

    public function __constructFull($userName, $password, $email, $idUser=null, $photo=null) {
        $this->userName = $userName;
        $this->password = $password;
        $this->email = $email;
        $this->idUser = $idUser;
        $this->photo = $photo;
    }

    // Método para convertir el objeto en un array asociativo
    public function toArray() {
        return [
            'idUser' => $this->idUser,
            'userName' => $this->userName,
            'password' => $this->password,
            'email' => $this->email,
            'photo' => $this->photo,
            'securityQuestion' => $this->securityQuestion,
            'securityAnswer' => $this->securityAnswer,
            'role' => $this->role
        ];
    }

    public function toArrayUserAdmin() {
        return [
            'idUser' => $this->idUser,
            'userName' => $this->userName,
            'email' => $this->email,
            'role' => $this->role
        ];
    }
}


?>
<?php

include "config/database.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $nama = $_POST["nama"];
    $email = $_POST["email"];
    $pesan = $_POST["pesan"];

    $query = "INSERT INTO messages (nama, email, pesan)
              VALUES ('$nama', '$email', '$pesan')";

    if (mysqli_query($conn, $query)) {

        echo "<script>
                alert('Pesan berhasil dikirim!');
                window.location.href='index.php#contact';
              </script>";

    } else {

        echo "Pesan gagal dikirim: " . mysqli_error($conn);

    }

}

?>
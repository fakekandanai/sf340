

$(document).ready(function () {


    function getCurrentDate() {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1; // Months are zero-indexed
        var day = now.getDate();

        // Pad single digit months and days with a leading zero
        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }

        return year + '-' + month + '-' + day;
    }

    // Function to get random color
    function getRandomColor() {
        var r = Math.floor(Math.random() * 128) + 128;
        var g = Math.floor(Math.random() * 128) + 128;
        var b = Math.floor(Math.random() * 128) + 128;
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    // Function to add a card to the card container
    function addCard() {
        var truckNamePlaceholder = "License Plate Number";
        var mileagePlaceholder = "Enter Mileage";
        var datePlaceholder = "Select Date";
        var driverName = "Enter Driver Name";
        var randomColor = getRandomColor();
        var card = `
        <div class="col-md-4">
            <div class="card" data-toggle="modal" data-target="#cardDetailsModal" style="background-color: ${randomColor};">
                <div class="card-body">
                    <h5 class="card-title">${truckNamePlaceholder}</h5>
                    <p class="card-text driver-text">Driver: ${driverName}</p>
                    <p class="card-text mileage-text">Mileage: ${mileagePlaceholder}</p>
                    <p class="card-text date-text">Date: ${datePlaceholder}</p>
                    <button class="btn btn-sm btn-primary deliver-truck-btn" style="position: absolute; top: 5px; right: 5px;"><i class="fas fa-truck"></i></button>
                </div>
            </div>
        </div>
    `;
        $("#cardContainer").append(card);
    }

    // Event handler for clicking "Add Card" button
    $("#addCardBtn").click(function (event) {
        event.preventDefault();
        $('#date').val(getCurrentDate());
        $('#cardDetailsModal').modal('show');
        $("#cardDetailsForm")[0].reset();
    });

    // Event handler for submitting card details form
    $("#cardDetailsForm").submit(function (event) {
        event.preventDefault();
        var truckName = $("#truckName").val();
        var mileage = $("#mileage").val();
        var date = $("#date").val();
        var driverName = $("#driverName").val();
        var editedCard = $(".card.editing");



        if (parseFloat(mileage) < 0) {
            alert("Mileage cannot be negative. Please enter a valid value.");
            return; // Exit the function without proceeding further
        }


        if (editedCard.length > 0) {
            var existingCard = editedCard.parent();
            existingCard.find(".card-title").text(truckName);
            existingCard.find(".mileage-text").text("Mileage: " + mileage);
            existingCard.find(".date-text").text("Date: " + date);
            existingCard.find(".driver-text").text("Driver: " + driverName);
            existingCard.removeClass("editing");
        } else {
            var randomColor = getRandomColor();
            var card = `
                <div class="col-md-4">
                    <div class="card" data-toggle="modal" data-target="#cardDetailsModal" style="background-color: ${randomColor};">
                        <div class="card-body">
                            <h5 class="card-title">${truckName}</h5>
                            <p class="card-text mileage-text">Mileage: ${mileage}</p>
                            <p class="card-text date-text">Date: ${date}</p>
                            <p class="card-text driver-text">Driver: ${driverName}</p>
                            <button class="btn btn-sm btn-primary deliver-truck-btn" style="position: absolute; top: 5px; right: 5px;"><i class="fas fa-truck"></i></button>
                        </div>
                    </div>
                </div>
            `;
            $("#cardContainer").append(card);
        }

        $("#cardDetailsForm")[0].reset();
        $('#cardDetailsModal').modal('hide');
        addCard;
    });

    // Event handler for clicking a card
    $("#cardContainer").on("click", ".card", function (event) {
        if (!$(event.target).hasClass("deliver-truck-btn")) { // ตรวจสอบว่าไม่ได้คลิกที่ปุ่มรถบรรทุก
            $(".card").removeClass("editing");
            $(this).addClass("editing");

            var truckName = $(this).find(".card-title").text();
            var mileage = $(this).find(".mileage-text").text().split(":")[1].trim();
            var date = $(this).find(".date-text").text().split(":")[1].trim();
            var driverName = $(this).find(".driver-text").text().split(":")[1].trim();
            $("#truckName").val(truckName);
            $("#mileage").val(mileage);
            $("#date").val(date);
            $("#driverName").val(driverName);
        }
    });

    // Event handler for deleting a card with confirmation and input for truck registration number
    $("#deleteCardBtn").click(function () {
        var editedCard = $(".card.editing");
        $('#cardDetailsModal').modal('hide'); // ซ่อน card details modal
        $('#confirmationModal').modal('show'); // แสดง confirmation modal

        // Event handler for the delete confirmation button
        $('#confirmDeleteBtn').off().click(function () {
            var truckRegNumber = $("#truckRegNumber").val(); // รับเลขทะเบียนรถจาก input field
            var cardTruckName = editedCard.find(".card-title").text(); // รับชื่อรถของการ์ดที่กำลังจะลบ

            if (truckRegNumber === cardTruckName) { // ตรวจสอบว่าเลขทะเบียนรถตรงกับรายการหรือไม่
                editedCard.parent().remove(); // ลบการ์ดออกจาก DOM
                $("#cardDetailsForm")[0].reset(); // รีเซ็ตฟอร์ม
                $('#confirmationModal').modal('hide'); // ซ่อน confirmation modal

                // Remove card data from localStorage
                var cardContainerHTML = $("#cardContainer").html();
                localStorage.setItem('cardContainerHTML', cardContainerHTML);

                // Remove truck details from localStorage
                localStorage.removeItem('truckDetails');
            } else {
                alert("License Plate Number does not match. Please enter the correct one to delete this card.");
            }
        });
    });




    // Event handler for showing "Deliver Truck Details" modal
    $("#deliverTruckBtn").click(function () {
        $('#cardDetailsModal').modal('hide');
        $('#deliverTruckModal').modal('show');
    });

    // Event handler for going back from "Deliver Truck Details" modal
    $("#goBackBtn").click(function () {
        $('#cardDetailsModal').modal('show');
        $('#deliverTruckModal').modal('hide');
    });

    // Event handler for calculating result
    $("#calculateBtn").click(function () {
        $('.modal').modal('hide');
        $('#calculationResultModal').modal('show').css('display', 'block');
    });

    // Event handler for going back from calculation result modal
    $("#goBackBtn").click(function () {
        $("#deliverTruckModal").modal("hide");
    });

    // Event handler for calculating result and displaying it
    $("#calculateBtn").click(function () {
        var currentMileage = parseFloat($("#Cmileage").val());
        var fuelAdded = parseFloat($("#AddedFuel").val());
        var mileage = parseFloat($("#mileage").val());
        var ratePerGallon = parseFloat($("#FuelPriceRate").val());

        var result = (fuelAdded - ((currentMileage - mileage) / 3)) * ratePerGallon;
        var message;
        if (result >= 0) {
            message = $("#driverName").val() + " You will get " + result.toFixed(2) + "$ from the company.";
        } else {
            message = $("#driverName").val() + " You have to pay " + Math.abs(result).toFixed(2) + "$ for the company.";
        }
        $("#calculationResult").text(message);
        $('#calculationResultModal').modal('show');

    });



    // Store data in localStorage when unloading the page
    $(window).on('unload', function () {
        // Save data to localStorage
        var cardContainerHTML = $("#cardContainer").html();
        localStorage.setItem('cardContainerHTML', cardContainerHTML);

        // Save data from Deliver Truck Details modal to localStorage
        var truckDetails = {
            truckName: $("#truckName").val(),
            mileage: $("#mileage").val(),
            date: $("#date").val(),
            driverName: $("#driverName").val()
        };
        localStorage.setItem('truckDetails', JSON.stringify(truckDetails));

        // Save data for "Current Mileage", "Fuel Added", "Fuel Price Rate", and "Date" to localStorage
        var currentMileage = $("#Cmileage").val();
        var fuelAdded = $("#AddedFuel").val();
        var fuelPriceRate = $("#FuelPriceRate").val();
        var dDate = $("#DDate").val();
        localStorage.setItem('currentMileage', currentMileage);
        localStorage.setItem('fuelAdded', fuelAdded);
        localStorage.setItem('fuelPriceRate', fuelPriceRate);
        localStorage.setItem('DDate', dDate);
    });

    // Retrieve data from localStorage on page load
    var storedCardContainerHTML = localStorage.getItem('cardContainerHTML');
    if (storedCardContainerHTML) {
        $("#cardContainer").html(storedCardContainerHTML);
    }

    // Retrieve data for Deliver Truck Details modal from localStorage on page load
    var storedTruckDetails = localStorage.getItem('truckDetails');
    if (storedTruckDetails) {
        var truckDetails = JSON.parse(storedTruckDetails);
        $("#truckName").val(truckDetails.truckName);
        $("#mileage").val(truckDetails.mileage);
        $("#date").val(truckDetails.date);
        $("#driverName").val(truckDetails.driverName);
    }

    // Retrieve data for "Current Mileage", "Fuel Added", "Fuel Price Rate", and "Date" from localStorage on page load
    var storedCurrentMileage = localStorage.getItem('currentMileage');
    var storedFuelAdded = localStorage.getItem('fuelAdded');
    var storedFuelPriceRate = localStorage.getItem('fuelPriceRate');
    var storedDDate = localStorage.getItem('DDate');
    if (storedCurrentMileage) {
        $("#Cmileage").val(storedCurrentMileage);
    }
    if (storedFuelAdded) {
        $("#AddedFuel").val(storedFuelAdded);
    }
    if (storedFuelPriceRate) {
        $("#FuelPriceRate").val(storedFuelPriceRate);
    }
    if (storedDDate) {
        $("#DDate").val(storedDDate);
    }

    $("#cardContainer").on("click", ".deliver-truck-btn", function () {
        $('#deliverTruckModal').modal('show');
    });

    $("#cardContainer").on("click", ".deliver-truck-btn", function (event) {
        event.stopPropagation(); // ป้องกันการส่งเหตุการณ์คลิกไปยัง card
        $('#deliverTruckModal').modal('show');
    });






    // Set the background image when the page loads
    $(document).ready(function () {
        // Retrieve the current background number from localStorage
        let backgroundNumber = localStorage.getItem("currentBackground");

        // If background number is found, set the background image accordingly
        if (backgroundNumber) {
            $("body").css("background-image", "url('bg" + backgroundNumber + ".jpg')");
        }
    });


    // Event handler for clicking the change background button
    $("#changeBackgroundBtn").click(function () {
        try {
            // Retrieve the current background number from localStorage
            let backgroundNumber = localStorage.getItem("currentBackground");

            // Convert the background number to integer
            backgroundNumber = parseInt(backgroundNumber);

            // If background number is not found or invalid, set it to 1
            if (isNaN(backgroundNumber) || backgroundNumber < 1 || backgroundNumber > 10) {
                backgroundNumber = 1;
            }

            // Calculate the next background number
            let nextBackgroundNumber = (backgroundNumber % 10) + 1;

            // Set the new background image
            $("body").css("background-image", "url('bg" + nextBackgroundNumber + ".jpg')");

            // Store the current background number in localStorage
            localStorage.setItem("currentBackground", nextBackgroundNumber);
        } catch (error) {
            console.error("An error occurred:", error);
        }
    });

    // Set the background image when the page loads
    $(document).ready(function () {
        // Retrieve the current background number from localStorage
        let backgroundNumber = localStorage.getItem("currentBackground");

        // If background number is found, set the background image accordingly
        if (backgroundNumber) {
            $("body").css("background-image", "url('bg" + backgroundNumber + ".jpg')");
        }
    });

    $(document).ready(function () {
        // Event handler สำหรับคลิกปุ่มค้นหา
        $("#searchBtn").click(function () {
            var searchText = $("#searchInput").val().trim().toLowerCase(); // ดึงข้อมูลที่ผู้ใช้กรอกและแปลงเป็นตัวพิมพ์เล็กทั้งหมด
            $(".card").each(function () { // วนลูปผ่าน card ทั้งหมด
                var truckName = $(this).find(".card-title").text().toLowerCase(); // ดึงข้อมูล truck name ของ card นี้และแปลงเป็นตัวพิมพ์เล็กทั้งหมด
                if (truckName.includes(searchText)) { // เช็คว่า truck name มี searchText ที่ผู้ใช้กรอกหรือไม่
                    $(this).show(); // แสดง card นี้
                } else {
                    $(this).hide(); // ซ่อน card นี้
                }
            });
        });

        // Event handler สำหรับล้างข้อมูลใน input field เมื่อคลิกปุ่มค้นหา
        $("#searchBtn").click(function () {
            $("#searchInput").val(""); // ล้างข้อมูลใน input field
        });
    });




    // Event handler สำหรับคลิกปุ่มรถบรรทุกบน card
    $("#cardContainer").on("click", ".deliver-truck-btn", function (event) {
        event.stopPropagation(); // ป้องกันการส่งเหตุการณ์คลิกไปยัง card
        $('#deliverTruckModal').modal('show'); // แสดง modal ของรถบรรทุก
    });



    // Event handler for clicking the "Clear All" button
    $("#deleteAllBtn").click(function () {
        // Check if there are any cards present on the page
        if ($("#cardContainer").children().length === 0) {
            alert("There are no cards to delete. Please add some cards first.");
            return; // Exit the function
        }

        // Confirm with the user before clearing all cards
        var confirmation = confirm("Are you sure you want to delete all cards?");
        if (confirmation) {
            // Remove all cards from the DOM
            $("#cardContainer").empty();

            // Clear localStorage data for cardContainerHTML and truckDetails
            localStorage.removeItem('cardContainerHTML');
            localStorage.removeItem('truckDetails');
        }
    });

    // Event handler for clicking the "Download Truck Data Report" button
    $("#downloadReportBtn").click(function () {
        // Initialize an empty string to store CSV data
        var csvData = "Truck License Plate Number,Initial Mileage,Current Mileage,Distance Traveled,Fuel Used,Date Recorded,Delivery Date,Driver Name\n";

        // Loop through each card to extract data
        $(".card").each(function () {
            var truckName = $(this).find(".card-title").text().trim();
            var initialMileage = parseFloat($(this).find(".mileage-text").text().split(":")[1].trim());
            var currentMileage = parseFloat($("#Cmileage").val());
            var distanceTraveled = currentMileage - initialMileage;
            var fuelUsed = (currentMileage - initialMileage) / 3;
            var dateRecorded = $("#date").val();
            var deliveryDate = $("#DDate").val();
            var driverName = $("#driverName").val();

            // Append data to CSV string
            csvData += `${truckName},${initialMileage},${currentMileage},${distanceTraveled},${fuelUsed},${dateRecorded},${deliveryDate},${driverName}\n`;
        });

        // Create a Blob object containing the CSV data
        var blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

        // Create a temporary anchor element
        var link = document.createElement("a");
        if (link.download !== undefined) { // Check if browser supports download attribute
            // Create a URL to the Blob object
            var url = URL.createObjectURL(blob);

            // Set the anchor's href attribute to the URL
            link.setAttribute("href", url);

            // Set the anchor's download attribute to the desired file name
            link.setAttribute("download", "truck_data_report.csv");

            // Click the anchor element programmatically to trigger download
            link.click();

            // Release the allocated resources
            URL.revokeObjectURL(url);
        } else {
            alert("Your browser does not support downloading files. Please try using a different browser.");
        }
    });






});


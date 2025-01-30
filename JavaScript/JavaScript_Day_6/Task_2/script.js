
        document.getElementById('preview-btn').addEventListener('click', (event) => {
            

            $(".text-danger").text("");
            const { jsPDF } = window.jspdf;
            const beneficialOwnerName = $("#beneficialOwnerName").val();
            const countryOfCitizenship = $("#countryOfCitizenship").val();
            const permanentAddress = $("#permanentAddress").val();
            const permanentAddress2 = $("#permanentAddress2").val();
            const city = $("#city").val();
            const stateProvince = $("#stateProvince").val();
            const postalCode = $("#postalCode").val();
            const mailingAddress = $("#mailingAddress").val();
            const mailingAddress2 = $("#mailingAddress2").val();
            const mailingCity = $("#mailingCity").val();
            const mailingStateProvince = $("#mailingStateProvince").val();
            const mailingPostalCode = $("#mailingPostalCode").val();
            const dateOfBirth = $("#dateOfBirth").val();
            const treatyCountry = $("#treatyCountry").val();
            const articleParagraph = $("#articleParagraph").val();
            const typeLabel = $("#typeLabel").val();
            const withholdingRate = $("#withholdingRate").val();
            const incomeType = $("#incomeType").val();
            const additionalConditions = $("#additionalConditions").val();
            const signatureDate = $("#signatureDate").val();
            const signerName = $("#signerName").val();
            const capacity = $("#capacity").val();

            const doc = new jsPDF();
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);

            // Add Form Data to the PDF
            doc.text(`Beneficial Owner Name: ${beneficialOwnerName}`, 10, 20);
            doc.text(`Country of Citizenship: ${countryOfCitizenship}`, 10, 30);
            doc.text(`Permanent Address: ${permanentAddress} ${permanentAddress2 ? ', ' + permanentAddress2 : ''}`, 10, 40);
            doc.text(`City: ${city}`, 10, 50);
            doc.text(`State/Province: ${stateProvince}`, 10, 60);
            doc.text(`Postal Code: ${postalCode}`, 10, 70);
            doc.text(`Mailing Address: ${mailingAddress} ${mailingAddress2 ? ', ' + mailingAddress2 : ''}`, 10, 80);
            doc.text(`Mailing City: ${mailingCity || "N/A"}`, 10, 90);
            doc.text(`Mailing State/Province: ${mailingStateProvince || "N/A"}`, 10, 100);
            doc.text(`Mailing Postal Code: ${mailingPostalCode || "N/A"}`, 10, 110);
            doc.text(`Date of Birth: ${dateOfBirth}`, 10, 120);
            doc.text(`Treaty Country: ${treatyCountry}`, 10, 130);
            doc.text(`Article and Paragraph: ${articleParagraph}`, 10, 140);
            doc.text(`Type Label: ${typeLabel}`, 10, 150);
            doc.text(`Withholding Rate: ${withholdingRate}`, 10, 160);
            doc.text(`Income Type: ${incomeType}`, 10, 170);
            doc.text(`Additional Conditions: ${additionalConditions}`, 10, 180);
            doc.text(`Signature Date: ${signatureDate}`, 10, 190);
            doc.text(`Signer Name: ${signerName}`, 10, 200);
            doc.text(`Capacity: ${capacity || "N/A"}`, 10, 210);

            // Add signature (if available)
            if (!signaturePad.isEmpty()) {
                const signatureData = signaturePad.toDataURL();
                doc.addImage(signatureData, "PNG", 10, 220, 50, 30);
            }

            // Preview the PDF (open in a new window/tab)
            doc.autoPrint();
            window.open(doc.output("bloburl"), "_blank");
        });

        const canvas = document.getElementById("signature-pad");
        const signaturePad = new SignaturePad(canvas);

        $("#certificateForm").on("submit", validateForm);

        function validateForm(event) {
            event.preventDefault();
            let isValid = true;

            $(".text-danger").text("");
            $(".form-control").removeClass("is-valid is-invalid");

            const namePattern = /^[a-zA-Z\s]{2,50}$/; // Only letters, spaces; 2-50 characters
            const countryPattern = /^[a-zA-Z\s]{2,50}$/; // Only letters, spaces; 2-50 characters
            const addressPattern = /^[a-zA-Z0-9\s,.-]{5,100}$/;
            const cityPattern = /^[a-zA-Z\s]{2,50}$/; // Only letters, spaces; 2-50 characters
            const statePattern = /^[a-zA-Z\s]{2,50}$/; // Only letters, spaces; 2-50 characters
            const postalPattern = /^[0-9]{5}(-[0-9]{4})?$/; // US ZIP: 5 digits or 5-4 format
            const datePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/; // YYYY-MM-DD with valid month/day

            // Validate Name
            const beneficialOwnerName = $("#beneficialOwnerName").val();
            if (!namePattern.test(beneficialOwnerName)) {
                $("#beneficialOwnerNameError").text("Name must contain only letters and spaces (2-50 characters).");
                $("#beneficialOwnerName").addClass("is-invalid");
                isValid = false;
            } else {
                $("#beneficialOwnerName").addClass("is-valid");
            }

            const countryOfCitizenship = $("#countryOfCitizenship").val();
            if (!countryPattern.test(countryOfCitizenship)) {
                $("#countryOfCitizenshipError").text("Country must contain only letters and spaces (2-50 characters).");
                $("#countryOfCitizenship").addClass("is-invalid");
                isValid = false;
            } else {
                $("#countryOfCitizenship").addClass("is-valid");
            }

            const permanentAddress = $("#permanentAddress").val();
            if (!addressPattern.test(permanentAddress)) {
                $("#permanentAddressError").text(
                    "Address must be alphanumeric, including spaces, commas, periods, or hyphens (5-100 characters)."
                );
                $("#permanentAddress").addClass("is-invalid");
                isValid = false;
            } else {
                $("#permanentAddress").addClass("is-valid");
            }

            // Validate City
            const city = $("#city").val();
            if (!cityPattern.test(city)) {
                $("#cityError").text("City must contain only letters and spaces (2-50 characters).");
                $("#city").addClass("is-invalid");
                isValid = false;
            } else {
                $("#city").addClass("is-valid");
            }

            // Validate State/Province
            const stateProvince = $("#stateProvince").val();
            if (!statePattern.test(stateProvince)) {
                $("#stateProvinceError").text("State/Province must contain only letters and spaces (2-50 characters).");
                $("#stateProvince").addClass("is-invalid");
                isValid = false;
            } else {
                $("#stateProvince").addClass("is-valid");
            }

            const countrySelect = $("#countrySelect").val();
            if (!countrySelect || countrySelect.length === 0) {
                $("#countrySelectError").text("Country is required.");
                $("#countrySelect").addClass("is-invalid");
                isValid = false;
            } else {
                $("#countrySelect").addClass("is-valid");
            }

            // Validate Postal Code
            const postalCode = $("#postalCode").val();
            if (!postalPattern.test(postalCode)) {
                $("#postalCodeError").text("Postal code must be in the format '12345' or '12345-6789'.");
                $("#postalCode").addClass("is-invalid");
                isValid = false;
            } else {
                $("#postalCode").addClass("is-valid");
            }

            const mailingAddress = $("#mailingAddress").val().trim();
            if (mailingAddress.length === 0) {
                $("#mailingAddress").addClass("is-invalid");
                $("#mailingAddressError").text("Street Address is required.");
                isValid = false;
            } else {
                $("#mailingAddress").addClass("is-valid");
            }

            // Validate Mailing Address Line 2 (optional)
            const mailingAddress2 = $("#mailingAddress2").val().trim();
            if (mailingAddress2.length > 0) {
                $("#mailingAddress2").addClass("is-valid");
            }

            // Validate City
            const mailingCity = $("#mailingCity").val().trim();
            if (mailingCity.length === 0) {
                $("#mailingCity").addClass("is-invalid");
                $("#mailingCityError").text("City is required.");
                isValid = false;
            } else {
                $("#mailingCity").addClass("is-valid");
            }

            // Validate State/Province
            const mailingStateProvince = $("#mailingStateProvince").val().trim();
            if (mailingStateProvince.length === 0) {
                $("#mailingStateProvince").addClass("is-invalid");
                $("#mailingStateProvinceError").text("State/Province is required.");
                isValid = false;
            } else {
                $("#mailingStateProvince").addClass("is-valid");
            }

            // Validate Postal Code
            const mailingPostalCode = $("#mailingPostalCode").val().trim();
            const postalCodePattern = /^[0-9]{5}(?:-[0-9]{4})?$/;
            if (mailingPostalCode.length === 0 || !postalCodePattern.test(mailingPostalCode)) {
                $("#mailingPostalCode").addClass("is-invalid");
                $("#mailingPostalCodeError").text("Valid Zip/Postal Code is required.");
                isValid = false;
            } else {
                $("#mailingPostalCode").addClass("is-valid");
            }

            // Validate Country
            const mailingCountry = $("#mailingStateSelect").val();
            if (!mailingCountry) {
                $("#mailingStateSelect").addClass("is-invalid");
                $("#mailingCountryError").text("Country is required.");
                isValid = false;
            } else {
                $("#mailingStateSelect").addClass("is-valid");
            }
            // Validate Foreign Tax ID
            const foreignTaxId = $("#foreignTaxId").val().trim();
            console.log(foreignTaxId);
            if (foreignTaxId.length == 0 && !addressPattern.test(foreignTaxId)) {

                $("#foreignTaxIdError").text("Foreign Tax ID must be alphanumeric (5-100 characters).");
                $("#foreignTaxId").addClass("is-invalid");
                isValid = false;
            } else {
                $("#foreignTaxId").addClass("is-valid");
            }

            const referenceNumber = $("#referenceNumber").val().trim();
            if (referenceNumber.length == 0 && !addressPattern.test(referenceNumber)) {
                $("#referenceNumberError").text("Reference Number must be alphanumeric (5-100 characters).");
                $("#referenceNumber").addClass("is-invalid");
                isValid = false;
            } else {
                $("#referenceNumber").addClass("is-valid");
            }

            const dateOfBirth = $("#dateOfBirth").val();
            if (!dateOfBirth) {
                $("#dateOfBirthError").text("Date of birth is required.");
                $("#dateOfBirth").addClass("is-invalid");
                isValid = false;
            } else {
                const today = new Date().toISOString().split("T")[0]; // Get today's date
                if (dateOfBirth >= today) {
                    $("#dateOfBirthError").text("Date of birth must be a past date.");
                    $("#dateOfBirth").addClass("is-invalid");
                    isValid = false;
                } else {
                    $("#dateOfBirth").addClass("is-valid");
                }
            }

            const treatyCountry = $("#treatyCountry").val();
            if (!countryPattern.test(treatyCountry)) {
                $("#treatyCountryError").text("Treaty country must contain only letters and spaces (2-50 characters).");
                $("#treatyCountry").addClass("is-invalid");
                isValid = false;
            } else {
                $("#treatyCountry").addClass("is-valid");
            }

            if (signaturePad.isEmpty()) {
                $("#signatureError").text("Signature is required")
                isValid = false;
            }

            const signatureDate = $("#signatureDate").val();
            if (!signatureDate) {
                $("#signatureDateError").text("Signature date is required.");
                $("#signatureDate").addClass("is-invalid");
                isValid = false;
            } else {
                $("#signatureDate").addClass("is-valid");
            }

            const signerName = $("#signerName").val();
            if (!namePattern.test(signerName)) {
                $("#signerNameError").text("Signer name must contain only letters and spaces (2-50 characters).");
                $("#signerName").addClass("is-invalid");
                isValid = false;
            } else {
                $("#signerName").addClass("is-valid");
            }

            const capacity = $("#capacity").val();
            if (!capacity && !addressPattern.test(capacity)) {
                $("#capacityError").text("Capacity must be alphanumeric (5-100 characters).");
                $("#capacity").addClass("is-invalid");
                isValid = false;
            } else {
                $("#capacity").addClass("is-valid");
            }

            const articleParagraph = $("#articleParagraph").val();
            if (!articleParagraph) {
                $("#articleParagraph").addClass("is-invalid");
                isValid = false;
            } else {
                $("#articleParagraph").addClass("is-valid");
            }

            // Validate Type Label
            const typeLabel = $("#typeLabel").val();
            if (!typeLabel) {
                $("#typeLabel").addClass("is-invalid");
                isValid = false;
            } else {
                $("#typeLabel").addClass("is-valid");
            }

            // Validate Withholding Rate
            const withholdingRate = $("#withholdingRate").val();
            const withholdingRatePattern = /^\d+(\.\d{1,2})?$/; // Allow numbers with optional two decimal places
            if (!withholdingRate || !withholdingRatePattern.test(withholdingRate)) {
                $("#withholdingRate").addClass("is-invalid");
                isValid = false;
            } else {
                $("#withholdingRate").addClass("is-valid");
            }

            // Validate Income Type
            const incomeType = $("#incomeType").val();
            if (!incomeType) {
                $("#incomeType").addClass("is-invalid");
                isValid = false;
            } else {
                $("#incomeType").addClass("is-valid");
            }

            // Validate Additional Conditions
            const additionalConditions = $("#additionalConditions").val();
            if (!additionalConditions) {
                $("#additionalConditions").addClass("is-invalid");
                isValid = false;
            } else {
                $("#additionalConditions").addClass("is-valid");
            }

            if (isValid) {
                const signatureData = signaturePad.toDataURL();
                alert("Form Submitted")
            }
            return isValid;
        }


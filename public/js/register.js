$('document').ready(function () {

    //File picker
    $(function () {
        $("input[type='file']").filepicker();
    });


    /*
     * Validator
     */

    //check that two fields ae not simultaneously empty
    $.validator.addMethod("notEmpty", function (val, elem, params) {
        var f1 = $('#' + params[0]).val(),
            f2 = $('#' + params[1]).val();
        return f1 !== "" && f2 !== "";
    }, 'Enter a valid school. Enter "Unlisted - [your school name]" if your school is not listed.');

    $.validator.addMethod("validMajor", function (val, elem) {
        var val = $('#major').val();
        return (engine3.get([val]).length != 0 || val.indexOf('Unlisted - ') == 0);
    }, 'Enter a valid major. Enter "Unlisted - [your major name]" if your major is not listed or "Undecided" if you do not have one.');

    //valid linkedin url or optional
    $.validator.addMethod("linkedinURL", function (val, elem, params) {
        return /^(www\.)?linkedin\.com\/\S+$/ig.test(val) || val === "";
    });

    notCornellText = 'We aren\'t accepting applications from Cornell University students right now.';

    //fails for cornell email
    $.validator.addMethod("emailNotCornell", function (val, elem, params) {
        return !/^[^@]+@cornell\.edu$/i.test(val);
    }, notCornellText);

    //fails for cornell school
    $.validator.addMethod("schoolNotCornell", function (val, elem, params) {
        var restrict = ["Cornell Tech - NY", "Cornell University - NY"];
        return (restrict.indexOf(val) == -1);
    }, notCornellText);
    
    $('#registrationForm').validate({
        ignore: 'input:not([name])', //ignore unnamed input tags
        onfocusout: function (e, event) {
            this.element(e); //validate field immediately
        },
        onkeyup: false,
        rules: {
            email: {
                required: true,
                email: true,
                emailNotCornell: $("#email").hasClass("not-cornell"),
                remote: "/api/validEmail"
            },
            password: {
                minlength: 6,
                maxlength: 25
            },
            confirmpassword: {
                required: true,
                minlength: 6,
                maxlength: 25,
                equalTo: "#password"
            },
            firstname: {
                required: true,
                minlength: 2
            },
            lastname: {
                required: true,
                minlength: 2
            },
            phonenumber: {
                required: true,
                phoneUS: true
            },
            college: {
                notEmpty: ['college', 'collegeid'],
                schoolNotCornell: true
            },
            major: {
                required: true,
                validMajor: [],
            },
            resume: {
                required: true,
                extension: "pdf",
                accept: 'application/pdf'
            },
            q1: {
                required: true,
                maxlength: 5000
            },
            q2: {
                required: true,
                maxlength: 5000
            },
            linkedin: {
                linkedinURL: true
            },
            anythingelse: {
                required: false,
                maxlength: 1000
            },
            hardware: {
                required: false,
                maxlength: 1000     
            }
        },
        messages: {
            email: {
                remote: "A user with that email already exists."
            },
            password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 6 characters long"
            },
            confirm_password: {
                required: "Please confirm your password",
                minlength: "Your password must be at least 6 characters long",
                equalTo: "Please enter the same password as above"
            },
            firstname: "Please enter your first name",
            lastname: "Please enter your last name",
            phonenumber: "Please provide a valid phone number",
            resume: "Please upload a valid .pdf",
            major: 'Enter a valid major. Enter "Unlisted - [your major name]" if your major is not listed, or "Undecided" if you do not have one.',
            linkedin: "Please provide a valid LinkedIn url",
            hardware: "Please hit enter to add a hardware",
        }
    });
});

// Disable hitting enter to submit
$('#registrationForm ').on('keyup keypress', function(e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
        e.preventDefault();
        return false;
    }
});

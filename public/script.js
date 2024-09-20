$(document).ready(function () {

    // by default the any value should be selected
    $('input[name="categories-choice"][value="any"]').prop('checked', true);
    // by default the safe value should be selected
    $('input[type="checkbox"][value="safe"]').prop('checked', true);

    // initially it will check
    updateCategoryState();

    function checkOptions() {
        // Attach the event handler once to avoid multiple bindings
        $('input[name="categories-option"]').off('change').on('change', function () {
            // Create a new array to collect selected values
            const selectedCategories = []; 
            
            // Iterate through each checked checkbox and collect their values
            $('input[name="categories-option"]:checked').each(function () {
                selectedCategories.push($(this).val());
            });
            
            // Join the selected values into a comma-separated string
            const selectedValue = selectedCategories.join(',');
            console.log(selectedValue);
            
            // Send the selected values to the server
            fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ selectedValue: selectedValue })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Server response: ', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }    

    function updateCategoryState() {
        const isAnyChecked = $('#category-any').is(':checked');
        const isCustomChecked = $('#category-custom').is(':checked');
        
        // for debugging purpose
        console.log('any: ' + isAnyChecked);
        console.log('custom: ', isCustomChecked);

        if (isAnyChecked) {
            $('input[name="categories-option"]').prop('checked', false).prop('disabled', true);
        }
        else if (isCustomChecked) {
            $('#category-any').prop('checked', false);
            $('input[name="categories-option"]').prop('disabled', false);
        }
    }

    $('input[name="categories-choice"]').on('change', function () {
        updateCategoryState();
        $('input[name="categories-option"]').off('change').on('change', function () {
        checkOptions();
        });
        // so that whenver i click on any choice base button on category section it calls this function
    });

    $(".content-container").on('click', '.setup', function () {
        $(".delivery").toggle();
    });

    $(".content-container").on('click', '.delivery', function () {
        $(".setup").toggle();
    });

    $("#refresh-btn").on('click', function () {
        fetch('/json', {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                updateContainer(data);
            })
            .catch(error => {
                console.log('Error: ', error);
            });
    });

    function updateContainer(Jokes) {
        $(".content-container").html('');
        if (Jokes.type == 'twopart') {
            const setup = $("<h1></h1>").addClass('setup');
            setup.text(Jokes.setup);
            const delivery = $("<h2></h2>").addClass('delivery');
            delivery.text(Jokes.delivery);
            $(".content-container").append(setup).append(delivery);
        }
        else if (Jokes.type == 'single') {
            const setup = $("<h1></h1>").addClass('setup');
            setup.text(Jokes.joke);
            $(".content-container").append(setup);
        }
    }
});

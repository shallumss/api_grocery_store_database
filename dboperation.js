var config = require('./dbconfig');
const sql = require('mssql'); 




async function getMovies() {
    try {
        let pool = await sql.connect(config);
        // Call the stored procedure
        let result = await pool.request()
            .execute('getMovie');
        
        return result.recordset;  // This will return the data fetched from the procedure
    } catch (error) {
        console.error('Error calling stored procedure:', error);
        throw new Error('Failed to fetch movies from the database');
    }
}
////query for getting the movies from the database desecnind order


async function getMoviesByRatingDescending() {
    try {
        let pool = await sql.connect(config);
        // Call the stored procedure
        let result = await pool.request()
            .execute('GetMoviesByRatingDescending');
        
        return result.recordset;  // This will return the data fetched from the procedure
    } catch (error) {
        console.error('Error calling stored procedure:', error);
        throw new Error('Failed to fetch movies from the database');
    }
}



///////////
///////////
/////////////
// UserSignup function to call the stored procedure
async function userSignup(
    username,
    email,
    password,
    firstName,
    lastName,
    phone,
    dob,
    profilePicture,
    country,
    city,
    state,
    house,
    postalCode
) {
    try {
        let pool = await sql.connect(config);

        // Call the stored procedure with all required inputs
        let result = await pool.request()
            .input('UserName', sql.VarChar(100), username)
            .input('Email', sql.VarChar(150), email)
            .input('Password', sql.VarChar(255), password) // Password should be hashed before passing
            .input('FirstName', sql.VarChar(50), firstName)
            .input('LastName', sql.VarChar(50), lastName)
            .input('Phone', sql.VarChar(15), phone || null) // Optional
            .input('DOB', sql.Date, dob || null) // Optional
            .input('ProfilePicture', sql.VarChar(255), profilePicture || null) // Optional
            .input('Country', sql.VarChar(100), country)
            .input('City', sql.VarChar(100), city)
            .input('State', sql.VarChar(100), state || null) // Optional
            .input('House', sql.VarChar(255), house)
            .input('PostalCode', sql.VarChar(20), postalCode)
            .execute('UserSignup');

        return result.recordset; // Return the result if needed
    } catch (error) {
        console.error('Error calling UserSignup procedure:', error);
        throw new Error('Failed to sign up user');
    }
}


//////////////
async function userLogin(loginIdentifier, password) {
    try {
        let pool = await sql.connect(config);

        // Call the UserLogin stored procedure
        let result = await pool.request()
            .input('LoginIdentifier', sql.VarChar(100), loginIdentifier)
            .input('Password', sql.VarChar(255), password) // Plain text password
            .execute('UserLogin');

        if (result.recordset.length > 0 && result.recordset[0].user_id) {
            return { success: true, userId: result.recordset[0].user_id };
        } else {
            // Check for specific error codes to determine the failure reason
            if (result.error.number === 50001) {
                return { success: false, message: 'Invalid email/username.' };
            } else if (result.error.number === 50002) {
                return { success: false, message: 'Invalid password.' };
            } else {
                // Handle other unexpected errors
                console.error('Error during user login:', result.error);
                return { success: false, message: 'Login failed. Please try again later.' };
            }
        }
    } catch (error) {
        console.error('Error during user login:', error);
        return { success: false, message: 'Login failed. Please try again later.' };
    }
}
/////////////// prodect info 

async function getProductDetails() {
    try {
        // Establish a connection to the database
        let pool = await sql.connect(config);

        // Execute the GetProductDetails stored procedure
        let result = await pool.request().execute('GetProductDetails');

        // Return the result set
        return result.recordset;
    } catch (error) {
        console.error('Error fetching product details:', error);
        throw new Error('Failed to fetch product details');
    }
}
/////////
// Add or Update Item in Cart
async function addToCart(user_id, product_id, quantity) {
    try { 
        // Establish a connection to the database
        let pool = await sql.connect(config);

        let  result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .input('product_id', sql.Int, product_id)
            .input('quantity', sql.Int, quantity)
            .execute('AddToCart'); // Call the stored procedure
        return result.rowsAffected;
    } catch (err) {
        throw new Error(`Error adding to cart: ${err.message}`);
    }
}

// View Cart
async function viewCart(user_id) {
    try { // Establish a connection to the database
        let pool = await sql.connect(config);

        let  result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .execute('ViewCart'); // Call the stored procedure
        return result.recordset;
    } catch (err) {
        throw new Error(`Error fetching cart: ${err.message}`);
    }
}

// Update Product Quantity
async function updateCart(user_id, product_id, quantity) {
    try {// Establish a connection to the database
        let pool = await sql.connect(config);

        let result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .input('product_id', sql.Int, product_id)
            .input('quantity', sql.Int, quantity)
            .execute('UpdateCart'); // Call the stored procedure
        return result.rowsAffected;
    } catch (err) {
        throw new Error(`Error updating cart: ${err.message}`);
    }
}

// Remove Item from Cart
async function removeFromCart(user_id, product_id) {
    try { 
        // Establish a connection to the database
        let pool = await sql.connect(config);

        let result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .input('product_id', sql.Int, product_id)
            .execute('RemoveFromCart'); // Call the stored procedure
        return result.rowsAffected;
    } catch (err) {
        throw new Error(`Error removing from cart: ${err.message}`);
    }
}

// Clear Cart
async function clearCart(user_id) {
    try {
        // Establish a connection to the database
        let pool = await sql.connect(config);


        let result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .execute('ClearCart'); // Call the stored procedure
        return result.rowsAffected;
    } catch (err) {
        throw new Error(`Error clearing cart: ${err.message}`);
    }
}

////cart checkout  

async function checkout(user_id) {
    try {
        // Establish a connection to the database
        let pool = await sql.connect(config);


        let result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .execute('Checkout'); // Call the stored procedure
        return result.rowsAffected;
    } catch (err) {
        throw new Error(`Error checking out cart: ${err.message}`);
    }
}
///////////view the specific orders of the user
// Function to get orders for a specific user
async function vieworders(user_id) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .execute('ViewUserOrders'); // Call the stored procedure
        return result.recordset;  // Return the recordset containing the orders
    } catch (err) {
        throw new Error(`Error loading orders: ${err.message}`);
    }
}

// Function to get details for a specific order
async function orderdetail(order_id) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('order_id', sql.Int, order_id)
            .execute('ViewOrderItems'); // Call the stored procedure
        return result.recordset;  // Return the recordset containing order items
    } catch (err) {
        throw new Error(`Error loading order details: ${err.message}`);
    }
}

/////////////
//////////////


module.exports = {  

    getMovies: getMovies ,
    getMoviesByRatingDescending: getMoviesByRatingDescending,
    userSignup : userSignup ,
    userLogin : userLogin   ,
    getProductDetails : getProductDetails    ,
    addToCart: addToCart,
    viewCart: viewCart,
    updateCart  : updateCart,
    removeFromCart  : removeFromCart,
    clearCart   : clearCart ,
    checkout : checkout ,
    vieworders : vieworders  ,
    orderdetail : orderdetail

}
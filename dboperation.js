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
        // Log the configuration for debugging
        console.log('Database Configuration:', {
            server: process.env.DB_SERVER,
            database: process.env.DB_DATABASE,
            user: process.env.DB_USER ? 'User is set' : 'User is NOT set',
            serverLength: process.env.DB_SERVER ? process.env.DB_SERVER.length : 'No server defined'
        });

        // Validate configuration
        if (!process.env.DB_SERVER) {
            throw new Error('Database server is not defined in environment variables');
        }

        // Ensure the server is a full Azure SQL server address
        const fullServerAddress = process.env.DB_SERVER.includes('.database.windows.net') 
            ? process.env.DB_SERVER 
            : `${process.env.DB_SERVER}.database.windows.net`;

        // Create a new configuration object each time to ensure fresh values
        const connectionConfig = {
            ...config,
            server: fullServerAddress
        };

        // Log the full server address
        console.log('Attempting to connect to server:', fullServerAddress);

        // Establish connection
        await sql.connect(connectionConfig);

        // Execute stored procedure
        const result = await sql.query`EXEC GetProductDetails`;

        // Close the connection
        await sql.close();

        return result.recordset;
    } catch (error) {
        // Detailed error logging
        console.error('Detailed Database Connection Error:', {
            message: error.message,
            name: error.name,
            stack: error.stack,
            originalError: error
        });

        // Rethrow or handle the error appropriately
        throw new Error(`Failed to fetch product details: ${error.message}`);
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
///

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
///// now function for the user search of products  in the database

// async function search(product_name) {
//     try {
//         let pool = await sql.connect(config);
//         let result = await pool.request()
//             .input('product_name', sql.NVarChar(255), product_name) // Correct input type
//             .execute('product_search'); // Call the stored procedure
//         return result.recordset; // Return the recordset
//     } catch (err) {
//         throw new Error(`Error loading products: ${err.message}`);
//     }
// }


//// now for the admin part of the project

async function getPendingOrDispatchOrders() {
    try {
        let pool = await sql.connect(config); // Connect to the database
        let result = await pool.request()
            .execute('GetPendingOrDispatchOrders'); // Call the stored procedure
        return result.recordset; // Return the list of orders
    } catch (err) {
        throw new Error(`Error loading orders: ${err.message}`); // Handle errors
    }
}


////////////

async function changeStatus(order_id, status_id) {
    try {
        let pool = await sql.connect(config); // Connect to the database
        let result = await pool.request()
            .input('order_id', sql.Int, order_id) // Pass order_id as INT
            .input('status_id', sql.Int, status_id) // Pass status_id as INT
            .execute('ChangeOrderStatus'); // Call the stored procedure
        return result.rowsAffected; // Return the rows affected (number of records updated)
    } catch (err) {
        throw new Error(`Error changing order status: ${err.message}`); // Handle errors
    }
}


//// when admin cancel the order

////// for the advanced user search 

// Function to search products based on filters (name, category, supplier)
async function productSearch({ product_name, supplier, category }) {
    try {
        let pool = await sql.connect(config);
        let request = pool.request();

       // console.log('Executing search with parameters:');
       // console.log('product_name:', product_name);
       // console.log('supplier:', supplier);
       // console.log('category:', category);

        // Explicitly handle parameters
        if (product_name !== null && product_name !== undefined) {
            request.input('product_name', sql.NVarChar, product_name);
        }
        if (supplier !== null && supplier !== undefined) {
            request.input('supplier_id', sql.Int, supplier);
        }
        if (category !== null && category !== undefined) {
            request.input('category_id', sql.Int, category);
        }

        let result = await request.execute('product_search');
        return result.recordset;
    } catch (err) {
      //  console.error('Database error:', err);
        throw new Error(`Error searching products: ${err.message}`);
    }
}
/////////////// for suppliers 
// Function to get all suppliers
async function getSuppliers() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .execute('get_suppliers'); // Call the stored procedure for suppliers

        return result.recordset;  // Return the list of suppliers
    } catch (err) {
        throw new Error(`Error getting suppliers: ${err.message}`);
    }
}

/////////// for categories 
// Function to get all categories
async function getCategories() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .execute('get_categories'); // Call the stored procedure for categories

        return result.recordset;  // Return the list of categories
    } catch (err) {
        throw new Error(`Error getting categories: ${err.message}`);
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
    orderdetail : orderdetail ,
   // search : search  ,
    getPendingOrDispatchOrders : getPendingOrDispatchOrders,
    changeStatus : changeStatus ,
    productSearch : productSearch ,
    getSuppliers : getSuppliers ,
    getCategories : getCategories 
}
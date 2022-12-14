import React, { useState, useEffect } from 'react'
import {
    useLocation, useNavigate,
} from 'react-router-dom'
import { publicRequest, userRequest } from '../../requestMethods'

import './SingleProduct.css'
import Navbar from '../../component/NavBar/Navbar'
import Annoucement from '../../component/Announcement/Announcement'
import Footer from '../../component/Footer/Footer'

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { addProduct, getUserCartStatus } from '../../redux/cartSlice'
import { useDispatch, useSelector } from 'react-redux'

function SingleProduct() {

  const dispatch = useDispatch()

  const userState = useSelector(state => state.user.currentUser)
  const cartState = useSelector(state => state.cart)

  const location = useLocation();
  const id = location.pathname.split('/')[2];

  const navigate = useNavigate();

  const [product, setProduct] = useState({})
  const [amount, setAmount] = useState(1)  

  useEffect(() => {
    const getProduct = async () => {
        try {
            const res = await publicRequest.get(`/products/find/${id}`)

            setProduct(res.data)
        } catch(err){
            console.log(err)
        }
    }

    getProduct()
  }, [id])
  
  const handleChangeAmount = (input) => {
    setAmount(prev => {
        return prev + input;
    })
  }

  const addToCart = async () => {
    if (userState.accessToken) {
        if (cartState.status) {
            const newProduct = {
                    productId: id,
                    name: product.name,
                    img: product.img,
                    manufacturer: product.manufacturer,
                    price: product.price,
                    quantity: amount
                }
            //Check if product already exist in cart
            const index = cartState.products.findIndex(product => product.productId === id) 
            let updatedCart = {}  
            if (index === -1) { //if no, add new
                updatedCart = {
                    userId: userState._id,
                    products: [...cartState.products, newProduct],
                    quantity: cartState.quantity + amount,
                    total: parseFloat(cartState.total) + parseFloat((product.price*amount))
                }
            } else { //if yes, increase quantity of that product
                let newProducts = JSON.parse(JSON.stringify(cartState.products))
                newProducts[index].quantity += amount

                updatedCart = {
                    userId: userState._id,
                    products: newProducts,
                    quantity: cartState.quantity + amount,
                    total: parseFloat(cartState.total) + parseFloat((product.price*amount))
                }
            }

            await userRequest.put(`/cart/${userState._id}`, updatedCart)
            dispatch(addProduct(newProduct))
            console.log(updatedCart)
        } else {
            const newCart = {
                userId: userState._id,
                products: [
                    {
                        productId: id,
                        name: product.name,
                        img: product.img,
                        manufacturer: product.manufacturer,
                        price: product.price,
                        quantity: amount
                    }
                ],
                quantity: amount,
                total: product.price*amount
            }
            const res =  await userRequest.post("/cart", newCart)
            if (res) {
                dispatch(getUserCartStatus(true))
            }
            dispatch(addProduct(newCart.products[0]))
        }
    } else {
        window.alert("You are not logged in or your session has expired. Please try again!")
    }
    
  }

  return (
    <div>
        <Annoucement />
        <Navbar />  
        <div className="spd-ctn">
            <button className='back-btn' onClick={() => navigate("/products")}>
                <ShoppingBagIcon style={{marginRight: 10}}/>
                Back to products page
            </button>
            <div className="wrapper">
                <div className="img-ctn">
                    <img src={product.img} alt="" />
                </div>
                <div className="info-ctn">
                    <h1>{product.name}</h1>
                    <p className="type">{product.type}</p>
                    {/* <p className="desc"><b>Description:</b> Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate nam sit vero libero atque laudantium, totam hic inventore maiores at? Consectetur dolorem soluta placeat commodi inventore voluptatibus perspiciatis. Dicta, aut!</p> */}
                    <p className="desc">Info:</p>
                    {
                        product.info ? 
                        <ul>
                            <li>{product.info[0]}</li>
                            <li>{product.info[1]}</li>
                            <li>{product.info[2]}</li>
                            <li>{product.info[3]}</li>
                        </ul> :
                        ""
                    }
                    <p className="year"><b>Release year:</b> {product.releaseYear}</p>
                    <p className="price">${product.price}</p>
                    <p className="stock"><b>Status:</b> In stock</p>
                    <div className="input-ctn">
                        <div className="amount-ctn">
                            <RemoveIcon className='icon' onClick={() => handleChangeAmount(-1)}/>
                            <span className="amount">{amount}</span>
                            <AddIcon className='icon' onClick={() => handleChangeAmount(1)}/>
                        </div>
                        <button onClick={() => addToCart()}>
                            <AddShoppingCartIcon style={{marginRight: 10}} />
                            Add to cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>  
    )
}

export default SingleProduct


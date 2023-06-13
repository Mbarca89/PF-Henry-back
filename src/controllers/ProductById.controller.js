import Product from "../models/Product";


const getProductById = async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };




  export default getProductById
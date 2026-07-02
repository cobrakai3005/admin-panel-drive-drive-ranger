import { useState } from "react";
import {
  getAllProductsApi,
  getProductByIdOrSlugApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  toggleProductStatusApi,
  getProductImagesApi,
  addProductImageApi,
  deleteProductImageApi,
  reorderProductImagesApi,
  getAllProductItemsApi,
  getProductItemByIdApi,
  createProductItemApi,
  updateProductItemApi,
  deleteProductItemApi,
  getProductAttributesApi,
  addProductAttributeApi,
  updateProductAttributeApi,
  deleteProductAttributeApi,
} from "../../api/products/index";

export default function useProduct() {
  // Loading states
  const [getAllProductsLoading, setGetAllProductsLoading] = useState(false);
  const [getProductByIdLoading, setGetProductByIdLoading] = useState(false);
  const [createProductLoading, setCreateProductLoading] = useState(false);
  const [updateProductLoading, setUpdateProductLoading] = useState(false);
  const [deleteProductLoading, setDeleteProductLoading] = useState(false);
  const [toggleProductStatusLoading, setToggleProductStatusLoading] =
    useState(false);

  const [getProductImagesLoading, setGetProductImagesLoading] = useState(false);
  const [addProductImageLoading, setAddProductImageLoading] = useState(false);
  const [deleteProductImageLoading, setDeleteProductImageLoading] =
    useState(false);
  const [reorderProductImagesLoading, setReorderProductImagesLoading] =
    useState(false);

  const [getAllProductItemsLoading, setGetAllProductItemsLoading] =
    useState(false);
  const [getProductItemByIdLoading, setGetProductItemByIdLoading] =
    useState(false);
  const [createProductItemLoading, setCreateProductItemLoading] =
    useState(false);
  const [updateProductItemLoading, setUpdateProductItemLoading] =
    useState(false);
  const [deleteProductItemLoading, setDeleteProductItemLoading] =
    useState(false);

  const [getProductAttributesLoading, setGetProductAttributesLoading] =
    useState(false);
  const [addProductAttributeLoading, setAddProductAttributeLoading] =
    useState(false);
  const [updateProductAttributeLoading, setUpdateProductAttributeLoading] =
    useState(false);
  const [deleteProductAttributeLoading, setDeleteProductAttributeLoading] =
    useState(false);

  // Error states
  const [getAllProductsError, setGetAllProductsError] = useState(null);
  const [getProductByIdError, setGetProductByIdError] = useState(null);
  const [createProductError, setCreateProductError] = useState(null);
  const [updateProductError, setUpdateProductError] = useState(null);
  const [deleteProductError, setDeleteProductError] = useState(null);
  const [toggleProductStatusError, setToggleProductStatusError] =
    useState(null);

  const [getProductImagesError, setGetProductImagesError] = useState(null);
  const [addProductImageError, setAddProductImageError] = useState(null);
  const [deleteProductImageError, setDeleteProductImageError] = useState(null);
  const [reorderProductImagesError, setReorderProductImagesError] =
    useState(null);

  const [getAllProductItemsError, setGetAllProductItemsError] = useState(null);
  const [getProductItemByIdError, setGetProductItemByIdError] = useState(null);
  const [createProductItemError, setCreateProductItemError] = useState(null);
  const [updateProductItemError, setUpdateProductItemError] = useState(null);
  const [deleteProductItemError, setDeleteProductItemError] = useState(null);

  const [getProductAttributesError, setGetProductAttributesError] =
    useState(null);
  const [addProductAttributeError, setAddProductAttributeError] =
    useState(null);
  const [updateProductAttributeError, setUpdateProductAttributeError] =
    useState(null);
  const [deleteProductAttributeError, setDeleteProductAttributeError] =
    useState(null);

  // ============ PRODUCT FUNCTIONS ============

  const getAllProducts = async () => {
    setGetAllProductsLoading(true);
    setGetAllProductsError(null);
    try {
      const response = await getAllProductsApi();
      return response.data;
    } catch (error) {
      setGetAllProductsError(error);
      throw error;
    } finally {
      setGetAllProductsLoading(false);
    }
  };

  const getProductByIdOrSlug = async (identifier) => {
    setGetProductByIdLoading(true);
    setGetProductByIdError(null);
    try {
      const response = await getProductByIdOrSlugApi(identifier);
      return response.data
    } catch (error) {
      setGetProductByIdError(error);
      throw error;
    } finally {
      setGetProductByIdLoading(false);
    }
  };

  const createProduct = async (formData) => {
    setCreateProductLoading(true);
    setCreateProductError(null);
    try {
      const response = await createProductApi(formData);
      return response.data
    } catch (error) {
      setCreateProductError(error);
      throw error;
    } finally {
      setCreateProductLoading(false);
    }
  };

  const updateProduct = async (productId, formData) => {
    setUpdateProductLoading(true);
    setUpdateProductError(null);
    try {
      const response = await updateProductApi(productId, formData);
      return response.data
    } catch (error) {
      setUpdateProductError(error);
      throw error;
    } finally {
      setUpdateProductLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    setDeleteProductLoading(true);
    setDeleteProductError(null);
    try {
      const response = await deleteProductApi(productId);
      return response.data
    } catch (error) {
      setDeleteProductError(error);
      throw error;
    } finally {
      setDeleteProductLoading(false);
    }
  };

  const toggleProductStatus = async (productId) => {
    setToggleProductStatusLoading(true);
    setToggleProductStatusError(null);
    try {
      const response = await toggleProductStatusApi(productId);
      return response.data
    } catch (error) {
      setToggleProductStatusError(error);
      throw error;
    } finally {
      setToggleProductStatusLoading(false);
    }
  };

  // ============ PRODUCT IMAGES FUNCTIONS ============

  const getProductImages = async (productId) => {
    setGetProductImagesLoading(true);
    setGetProductImagesError(null);
    try {
      const response = await getProductImagesApi(productId);
      return response.data
    } catch (error) {
      setGetProductImagesError(error);
      throw error;
    } finally {
      setGetProductImagesLoading(false);
    }
  };

  const addProductImage = async (productId, formData) => {
    setAddProductImageLoading(true);
    setAddProductImageError(null);
    try {
      const response = await addProductImageApi(productId, formData);
      return response.data
    } catch (error) {
      setAddProductImageError(error);
      throw error;
    } finally {
      setAddProductImageLoading(false);
    }
  };

  const deleteProductImage = async (imageId) => {
    setDeleteProductImageLoading(true);
    setDeleteProductImageError(null);
    try {
      const response = await deleteProductImageApi(imageId);
      return response.data
    } catch (error) {
      setDeleteProductImageError(error);
      throw error;
    } finally {
      setDeleteProductImageLoading(false);
    }
  };

  const reorderProductImages = async (productId, reorderData) => {
    setReorderProductImagesLoading(true);
    setReorderProductImagesError(null);
    try {
      const response = await reorderProductImagesApi(productId, reorderData);
      return response.data
    } catch (error) {
      setReorderProductImagesError(error);
      throw error;
    } finally {
      setReorderProductImagesLoading(false);
    }
  };

  // ============ PRODUCT ITEMS FUNCTIONS ============

  const getAllProductItems = async () => {
    setGetAllProductItemsLoading(true);
    setGetAllProductItemsError(null);
    try {
      const response = await getAllProductItemsApi();
      return response.data
    } catch (error) {
      setGetAllProductItemsError(error);
      throw error;
    } finally {
      setGetAllProductItemsLoading(false);
    }
  };

  const getProductItemById = async (itemId) => {
    setGetProductItemByIdLoading(true);
    setGetProductItemByIdError(null);
    try {
      const response = await getProductItemByIdApi(itemId);
      return response.data
    } catch (error) {
      setGetProductItemByIdError(error);
      throw error;
    } finally {
      setGetProductItemByIdLoading(false);
    }
  };

  const createProductItem = async (formData) => {
    setCreateProductItemLoading(true);
    setCreateProductItemError(null);
    try {
      const response = await createProductItemApi(formData);
      return response.data
    } catch (error) {
      setCreateProductItemError(error);
      throw error;
    } finally {
      setCreateProductItemLoading(false);
    }
  };

  const updateProductItem = async (itemId, formData) => {
    setUpdateProductItemLoading(true);
    setUpdateProductItemError(null);
    try {
      const response = await updateProductItemApi(itemId, formData);
      return response.data
    } catch (error) {
      setUpdateProductItemError(error);
      throw error;
    } finally {
      setUpdateProductItemLoading(false);
    }
  };

  const deleteProductItem = async (itemId) => {
    setDeleteProductItemLoading(true);
    setDeleteProductItemError(null);
    try {
      const response = await deleteProductItemApi(itemId);
      return response.data
    } catch (error) {
      setDeleteProductItemError(error);
      throw error;
    } finally {
      setDeleteProductItemLoading(false);
    }
  };

  // ============ PRODUCT ATTRIBUTES FUNCTIONS ============

  const getProductAttributes = async (productId) => {
    setGetProductAttributesLoading(true);
    setGetProductAttributesError(null);
    try {
    const response = await getProductAttributesApi(productId);
      return response.data
    } catch (error) {
      setGetProductAttributesError(error);
      throw error;
    } finally {
      setGetProductAttributesLoading(false);
    }
  };

  const addProductAttribute = async (productId, attributeData) => {
    setAddProductAttributeLoading(true);
    setAddProductAttributeError(null);
    try {
      const response = await addProductAttributeApi(productId, attributeData);
      return response.data
    } catch (error) {
      setAddProductAttributeError(error);
      throw error;
    } finally {
      setAddProductAttributeLoading(false);
    }
  };

  const updateProductAttribute = async (attributeId, attributeData) => {
    setUpdateProductAttributeLoading(true);
    setUpdateProductAttributeError(null);
    try {
      const response = await updateProductAttributeApi(
        attributeId,
        attributeData,
      );
      return response.data
    } catch (error) {
      setUpdateProductAttributeError(error);
      throw error;
    } finally {
      setUpdateProductAttributeLoading(false);
    }
  };

  const deleteProductAttribute = async (attributeId) => {
    setDeleteProductAttributeLoading(true);
    setDeleteProductAttributeError(null);
    try {
      const response = await deleteProductAttributeApi(attributeId);
      return response.data
    } catch (error) {
      setDeleteProductAttributeError(error);
      throw error;
    } finally {
      setDeleteProductAttributeLoading(false);
    }
  };

  return {
    // Product functions
    getAllProducts,
    getProductByIdOrSlug,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,

    // Product Images functions
    getProductImages,
    addProductImage,
    deleteProductImage,
    reorderProductImages,

    // Product Items functions
    getAllProductItems,
    getProductItemById,
    createProductItem,
    updateProductItem,
    deleteProductItem,

    // Product Attributes functions
    getProductAttributes,
    addProductAttribute,
    updateProductAttribute,
    deleteProductAttribute,

    // Product loading states
    getAllProductsLoading,
    getProductByIdLoading,
    createProductLoading,
    updateProductLoading,
    deleteProductLoading,
    toggleProductStatusLoading,

    // Product Images loading states
    getProductImagesLoading,
    addProductImageLoading,
    deleteProductImageLoading,
    reorderProductImagesLoading,

    // Product Items loading states
    getAllProductItemsLoading,
    getProductItemByIdLoading,
    createProductItemLoading,
    updateProductItemLoading,
    deleteProductItemLoading,

    // Product Attributes loading states
    getProductAttributesLoading,
    addProductAttributeLoading,
    updateProductAttributeLoading,
    deleteProductAttributeLoading,

    // Product error states
    getAllProductsError,
    getProductByIdError,
    createProductError,
    updateProductError,
    deleteProductError,
    toggleProductStatusError,

    // Product Images error states
    getProductImagesError,
    addProductImageError,
    deleteProductImageError,
    reorderProductImagesError,

    // Product Items error states
    getAllProductItemsError,
    getProductItemByIdError,
    createProductItemError,
    updateProductItemError,
    deleteProductItemError,

    // Product Attributes error states
    getProductAttributesError,
    addProductAttributeError,
    updateProductAttributeError,
    deleteProductAttributeError,
  };
}

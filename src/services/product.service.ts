import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid';
import { Product, ProductData } from '../schemas/products.schema';
import { UpdateProductDto } from '../dtos/updateProduct.dto';
import { ProductCsvDto } from '../dtos/product.dto';
import { VariantType } from '../enum/variantType.enum';
import { Variant } from '../schemas/variant.schema';
import { Option } from '../schemas/option.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  findAll() {
    return this.productModel.find().exec();
  }

  findOneByProductId(productId: number) {
    return this.productModel.findOne({ productId }).exec();
  }

  async updateProductDescription(updateProductDto: UpdateProductDto) {
    const doc = await this.findOneByProductId(updateProductDto.productId);
    doc.data.description = updateProductDto.description;
    return doc.save();
  }

  remove(id: number) {
    return this.productModel
      .updateOne({ _id: id }, { soft_delete: 'deleted' })
      .exec();
  }

  async create(createProductDto: ProductCsvDto) {
    const existingDocument = await this.findOneByProductId(
      createProductDto.ProductID,
    );

    if (!existingDocument) {
      const formattedProduct = this.formatCsvDataToProduct(createProductDto);
      const formattedVariant = this.createProductVariant(createProductDto);
      const formattedOption = this.createProductOption(createProductDto);

      formattedProduct.data.variants = [formattedVariant];
      formattedProduct.data.options = formattedOption;
      const newRecord = await this.productModel.create(formattedProduct);
      console.log(
        'Creating new record for product: ' + formattedProduct.productId,
      );
      return newRecord;
    } else {
      const variant = this.createProductVariant(createProductDto);
      existingDocument.data.variants.push(variant);

      const isDescriptionVariant = !existingDocument.data.variants.some(
        (i) => i.description == createProductDto.ItemDescription,
      );
      const isPackagingVariant = !existingDocument.data.variants.some(
        (i) => i.packaging == createProductDto.PKG,
      );

      if (!isPackagingVariant && !isDescriptionVariant) {
        console.error('Mixed variants');
      }

      const { packagingOptionValues, descriptionOptionValues } =
        this.createProductOptionValues(
          createProductDto,
          isDescriptionVariant,
          isPackagingVariant,
        );

      if (createProductDto.PKG) {
        existingDocument.data.options
          .find((i) => i.name == VariantType.PACKAGING)
          .values.push(packagingOptionValues[0]);
      }

      if (createProductDto.ItemDescription) {
        existingDocument.data.options
          .find((i) => i.name == VariantType.ITEM_DESCRIPTION)
          .values.push(descriptionOptionValues[0]);
      }
      console.log('before save');
      await existingDocument.save();
      console.log(
        'after Updating record for product: ' + existingDocument.productId,
      );
    }
  }

  formatCsvDataToProduct(createProductDto: ProductCsvDto) {
    const data: ProductData = {
      name: createProductDto.ProductName,
      type: 'non-inventory',
      shortDescription: createProductDto.ProductDescription,
      description: createProductDto.ProductDescription,
      vendorId: '',
      manufacturerId: createProductDto.ManufacturerID,
      storefrontPriceVisibility: '"members-only"',
      availability: createProductDto.Availability,
      isFragile: true,
      published: true,
      isTaxable: true,
      categoryId: createProductDto.CategoryID,
      options: [],
      images: [
        {
          fileName: createProductDto.ImageFileName,
          cdnLink: createProductDto.ItemImageURL,
        },
      ],
      variants: [],
      deleted: false,
    };

    const product: Product = {
      productId: createProductDto.ProductID,
      docId: nanoid(),
      data: data,
      fullData: '',
      immutable: false,
      docType: 'item',
      namespace: 'items',
      soft_delete: 'active',
    };

    return product;
  }

  createProductVariant(createProductDto: ProductCsvDto) {
    const variant: Variant = {
      id: this.generateRandomString(12),
      itemId: createProductDto.ItemID,
      available: createProductDto.Availability,
      cost: createProductDto.UnitPrice,
      attributes: null,
      currency: 'USD',
      depth: null,
      height: null,
      description: createProductDto.ItemDescription,
      dimensionUom: null,
      manufacturerItemCode: createProductDto.ManufacturerItemCode,
      manufacturerItemId: createProductDto.ItemID,
      width: null,
      packaging: createProductDto.PKG,
      price: createProductDto.UnitPrice,
      volume: null,
      volumeUom: null,
      weight: null,
      weightUom: null,
      optionName: `${createProductDto.PKG}, ${createProductDto.ItemDescription}`,
      optionsPath: '',
      optionItemsPath: '',
      sku: null,
      active: true,
      images: [],
      itemCode: createProductDto.NDCItemCode,
    };

    return variant;
  }

  createProductOption(createProductDto: ProductCsvDto): Option[] {
    const optionDescription: Option = {
      id: this.generateRandomString(6),
      name: VariantType.ITEM_DESCRIPTION,
      dataField: '',
      values: [],
    };

    if (createProductDto.ItemDescription) {
      optionDescription.values.push({
        id: this.generateRandomString(6),
        name: createProductDto.ItemDescription,
        value: createProductDto.ItemDescription,
      });
    }

    const optionPackaging: Option = {
      id: this.generateRandomString(6),
      name: VariantType.PACKAGING,
      dataField: '',
      values: [],
    };
    if (createProductDto.PKG) {
      optionPackaging.values.push({
        id: this.generateRandomString(6),
        name: createProductDto.PKG,
        value: createProductDto.PKG,
      });
    }
    return [optionDescription, optionPackaging];
  }

  createProductOptionValues(
    createProductDto: ProductCsvDto,
    isDescriptionVariant: boolean,
    isPackagingVariant: boolean,
  ): {
    descriptionOptionValues: { id: string; name: string; value: string }[];
    packagingOptionValues: { id: string; name: string; value: string }[];
  } {
    const descriptionOptionValues = [];
    const packagingOptionValues = [];

    if (isDescriptionVariant) {
      descriptionOptionValues.push({
        id: this.generateRandomString(6),
        name: createProductDto.ItemDescription,
        value: createProductDto.ItemDescription,
      });
    }

    if (isPackagingVariant) {
      packagingOptionValues.push({
        id: this.generateRandomString(6),
        name: createProductDto.PKG,
        value: createProductDto.PKG,
      });
    }

    return { descriptionOptionValues, packagingOptionValues };
  }

  generateRandomString(length: number) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  count() {
    return this.productModel.countDocuments({});
  }

  findOne(id: number) {
    return this.productModel.findOne({ _id: id }).exec();
  }
}

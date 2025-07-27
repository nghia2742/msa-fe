import {
    useCreateProductMutation,
    useProductsQuery,
} from '@/shared/core/generated/graphql';
import { useState } from 'react';

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

type TProductInput = {
    productName: string;
    price: number;
    description: string;
};

function ProductModule() {
    const [isOpenForm, setIsOpenForm] = useState(false);

    const { data, refetch } = useProductsQuery();
    const [sendRequest] = useCreateProductMutation({
        onCompleted: () => {
            alert('Created Successfully! 👍👍👍');
            setIsOpenForm(false);
            refetch()
        },
        onError: () => {
            alert('Failed! 👎👎👎');
        },
    });

    const handleCancel = () => {
        setIsOpenForm(false);
    };

    const handleSubmit = (data: TProductInput) => {
        sendRequest({
            variables: {
                input: data,
            },
        });
    };

    return (
        <div>
            {/* FORM */}
            <div>
                {isOpenForm ? (
                    <Form
                        handleCancel={handleCancel}
                        handleSubmit={handleSubmit}
                    />
                ) : (
                    <>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setIsOpenForm(true)}
                                type="button"
                                className="mb-4 justify-center items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white rounded-lg focus:ring-4 hover:bg-primary-800 bg-green-600 hover:bg-green-700 focus:ring-green-800 cursor-pointer"
                            >
                                Add
                            </button>
                        </div>
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Product name
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Price
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Price
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.products.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                                        >
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {product.productName}
                                            </th>
                                            <td className="px-6 py-4">
                                                {formatter.format(
                                                    product.price
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {product.description}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function Form({
    handleSubmit,
    handleCancel,
}: {
    handleCancel: () => void;
    handleSubmit: (data: TProductInput) => void;
}) {
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [description, setDescription] = useState('');

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit({
            productName,
            price: Number(price),
            description,
        });
    };

    return (
        <section className="bg-white dark:bg-gray-900 rounded-4xl">
            <div className="p-4 mx-auto max-w-2xl lg:py-8 lg:px-12">
                <div className="flex justify-end">
                    <button onClick={handleCancel} className="cursor-pointer">
                        ❌
                    </button>
                </div>
                <h2 className="my-4 text-xl font-bold text-gray-900 dark:text-white">
                    Add a new product
                </h2>
                <form onSubmit={onSubmit}>
                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                        <div className="w-full">
                            <label
                                htmlFor="productName"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Product Name
                            </label>
                            <input
                                type="text"
                                name="productName"
                                id="productName"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Product Name"
                            />
                        </div>
                        <div className="w-full">
                            <label
                                htmlFor="price"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Price
                            </label>
                            <input
                                type="number"
                                name="price"
                                id="price"
                                value={price}
                                onChange={(e) =>
                                    setPrice(parseFloat(e.target.value) || '')
                                }
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="$2999"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="description"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Description
                            </label>
                            <textarea
                                id="description"
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="block min-w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Write your thoughts here..."
                            ></textarea>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="flex w-full justify-center items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white rounded-lg focus:ring-4 hover:bg-primary-800 bg-green-600 hover:bg-green-700 focus:ring-green-800 cursor-pointer"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </section>
    );
}

export default ProductModule;

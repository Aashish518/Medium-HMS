import React, { useEffect, useState } from 'react';
import '../components-css/Slider.css';

export const Slider = () => {
    const images = ['/photo1.jpg', '/photo2.jpg', '/photo3.jpg','/photo4.jpg'];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="slider">
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`slide ${index === currentIndex ? 'active' : ''}`}
                >
                    <img src={image} alt={`Hostel ${index + 1}`} />
                </div>
            ))}
        </div>
    );
};

import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
          About Boutique-Ku
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Providing quality fashion since 2025.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <img 
          src="https://picsum.photos/seed/store/1200/500" 
          alt="Our boutique"
          className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md mb-12"
        />
        <div className="space-y-6 text-gray-700 dark:text-gray-300 text-left md:text-justify leading-relaxed">
          <p>
            Welcome to Boutique-Ku, your premier destination for exclusive and high-quality fashion. Our journey began in 2025 with a simple mission: to bring curated, stylish, and timeless pieces to fashion enthusiasts everywhere. We believe that style is a personal expression, and our collection is carefully selected to help you tell your own story.
          </p>
          <p>
            At Boutique-Ku, we pride ourselves on our commitment to quality. From the finest materials to impeccable craftsmanship, every item in our store is chosen to meet the highest standards. We work with both established designers and emerging talents to offer a unique selection that you won't find anywhere else.
          </p>
          <p>
            Our team is passionate about fashion and dedicated to providing an exceptional shopping experience. Whether you're looking for the perfect outfit for a special occasion or a timeless piece to add to your wardrobe, we're here to help you find it. Thank you for being a part of our story.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
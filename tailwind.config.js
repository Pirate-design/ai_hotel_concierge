module.exports = {
  content: ["./pages/*.{html,js}", "./index.html", "./js/*.js", "./components/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        // Primary Colors - Deep Navy
        primary: {
          DEFAULT: "#1E3A5F", // Deep navy
          50: "#F0F4F8", // Very light navy - slate-50
          100: "#D6E3F0", // Light navy - slate-100
          200: "#B8CCE0", // Medium light navy - slate-200
          300: "#9BB5D1", // Medium navy - slate-300
          400: "#7E9EC1", // Medium dark navy - slate-400
          500: "#6187B2", // Dark navy - slate-500
          600: "#4F6F94", // Darker navy - slate-600
          700: "#3D5775", // Very dark navy - slate-700
          800: "#2B3F57", // Deep navy variant - slate-800
          900: "#1E3A5F", // Primary deep navy - slate-900
        },
        
        // Secondary Colors - Soft Blue-White
        secondary: {
          DEFAULT: "#F7F9FC", // Soft blue-white - slate-50
          50: "#F7F9FC", // Soft blue-white - slate-50
          100: "#EDF2F7", // Light blue-gray - gray-100
          200: "#E2E8F0", // Medium light blue-gray - gray-200
          300: "#CBD5E0", // Medium blue-gray - gray-300
          400: "#A0AEC0", // Medium dark blue-gray - gray-400
          500: "#718096", // Dark blue-gray - gray-500
        },
        
        // Accent Colors - Warm Gold
        accent: {
          DEFAULT: "#D4AF37", // Warm gold - yellow-600
          50: "#FDF8E8", // Very light gold - yellow-50
          100: "#FAF0D0", // Light gold - yellow-100
          200: "#F5E1A1", // Medium light gold - yellow-200
          300: "#F0D272", // Medium gold - yellow-300
          400: "#EBC343", // Medium dark gold - yellow-400
          500: "#E6B414", // Dark gold - yellow-500
          600: "#D4AF37", // Primary warm gold - yellow-600
          700: "#B8941E", // Darker gold - yellow-700
          800: "#9C7A05", // Very dark gold - yellow-800
        },
        
        // Background Colors
        background: "#FFFFFF", // Pure white - white
        surface: "#F8FAFC", // Subtle gray-blue - slate-50
        
        // Text Colors
        text: {
          primary: "#1A202C", // Near-black - gray-900
          secondary: "#718096", // Medium gray - gray-500
        },
        
        // Status Colors
        success: {
          DEFAULT: "#38A169", // Forest green - green-600
          50: "#F0FFF4", // Very light green - green-50
          100: "#C6F6D5", // Light green - green-100
          200: "#9AE6B4", // Medium light green - green-200
          300: "#68D391", // Medium green - green-300
          400: "#48BB78", // Medium dark green - green-400
          500: "#38A169", // Primary forest green - green-500
        },
        
        warning: {
          DEFAULT: "#D69E2E", // Amber - yellow-600
          50: "#FFFBEB", // Very light amber - amber-50
          100: "#FEF5E7", // Light amber - amber-100
          200: "#FDE68A", // Medium light amber - amber-200
          300: "#F6CC02", // Medium amber - amber-300
          400: "#ECC94B", // Medium dark amber - amber-400
          500: "#D69E2E", // Primary amber - amber-500
        },
        
        error: {
          DEFAULT: "#E53E3E", // Warm red - red-500
          50: "#FED7D7", // Very light red - red-100
          100: "#FEB2B2", // Light red - red-200
          200: "#FC8181", // Medium light red - red-300
          300: "#F56565", // Medium red - red-400
          400: "#E53E3E", // Primary warm red - red-500
          500: "#C53030", // Dark red - red-600
        },
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
        jetbrains: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      
      boxShadow: {
        'conversation': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'elevated': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.12)',
      },
      
      borderRadius: {
        'message': '20px',
        'card': '8px',
      },
      
      animation: {
        'pulse-voice': 'pulse-voice 2s infinite',
        'slide-in-top': 'slide-in-top 300ms ease-out',
        'fade-in': 'fade-in 200ms ease-out',
      },
      
      keyframes: {
        'pulse-voice': {
          '0%, 100%': {
            opacity: '0.3',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '0.8',
            transform: 'scale(1.1)',
          },
        },
        'slide-in-top': {
          'from': {
            transform: 'translateY(-100%)',
            opacity: '0',
          },
          'to': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        'fade-in': {
          'from': {
            opacity: '0',
          },
          'to': {
            opacity: '1',
          },
        },
      },
      
      transitionDuration: {
        '150': '150ms',
        '300': '300ms',
      },
      
      transitionTimingFunction: {
        'ease-out': 'ease-out',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      
      scale: {
        '98': '0.98',
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      
      maxWidth: {
        'xs': '20rem',
        'conversation': '48rem',
      },
    },
  },
  plugins: [],
}
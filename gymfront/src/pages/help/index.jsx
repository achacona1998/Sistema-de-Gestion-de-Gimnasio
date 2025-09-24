import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronRight, MessageCircle, Phone, Mail, Book, Video, FileText, Users, CreditCard, Calendar, Settings, HelpCircle } from 'lucide-react';
import api from '../../services/api';

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('general');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = [
    { id: 'general', name: 'General', icon: HelpCircle },
    { id: 'membership', name: 'Membresías', icon: CreditCard },
    { id: 'classes', name: 'Clases', icon: Calendar },
    { id: 'account', name: 'Mi Cuenta', icon: Users },
    { id: 'technical', name: 'Soporte Técnico', icon: Settings }
  ];

  const [faqs, setFaqs] = useState({
    general: [],
    membership: [],
    classes: [],
    account: [],
    technical: []
  });

  // Cargar FAQs desde la API
  const loadFaqs = async () => {
    try {
      // Intentar cargar desde la API (endpoint hipotético)
      // const response = await api.get('/faqs/');
      // const faqsData = response.data.results || response.data;
      
      // Por ahora, usar datos por defecto ya que no existe el endpoint
      const defaultFaqs = {
        general: [
          {
            id: 1,
            question: '¿Cuáles son los horarios del gimnasio?',
            answer: 'Nuestro gimnasio está abierto de lunes a viernes de 5:00 AM a 11:00 PM, sábados de 6:00 AM a 10:00 PM y domingos de 7:00 AM a 9:00 PM. Los horarios pueden variar en días festivos.'
          },
      {
        id: 2,
        question: '¿Necesito hacer reserva para usar el gimnasio?',
        answer: 'No es necesario hacer reserva para usar el área de pesas y cardio. Sin embargo, sí necesitas reservar para clases grupales y entrenamientos personales.'
      },
      {
        id: 3,
        question: '¿Qué debo traer para mi primera visita?',
        answer: 'Para tu primera visita, trae una identificación oficial, ropa deportiva cómoda, zapatos deportivos y una toalla. También recomendamos traer una botella de agua.'
      },
      {
        id: 4,
        question: '¿Tienen casilleros disponibles?',
        answer: 'Sí, tenemos casilleros disponibles en los vestidores. Puedes usar tu propia candado o rentar uno en recepción por una pequeña tarifa diaria.'
      }
    ],
    membership: [
      {
        id: 5,
        question: '¿Qué tipos de membresías ofrecen?',
        answer: 'Ofrecemos membresías básicas (acceso al gimnasio), premium (incluye clases grupales) y VIP (incluye entrenamientos personales). También tenemos pases diarios y semanales.'
      },
      {
        id: 6,
        question: '¿Puedo congelar mi membresía?',
        answer: 'Sí, puedes congelar tu membresía por razones médicas o viajes prolongados. Se requiere documentación y hay una tarifa administrativa mínima.'
      },
      {
        id: 7,
        question: '¿Cómo cancelo mi membresía?',
        answer: 'Para cancelar tu membresía, debes notificarnos con 30 días de anticipación por escrito. Puedes hacerlo en recepción o enviando un correo a cancelaciones@gimnasio.com.'
      },
      {
        id: 8,
        question: '¿Ofrecen descuentos para estudiantes?',
        answer: 'Sí, ofrecemos un 20% de descuento para estudiantes con credencial vigente. También tenemos descuentos familiares y para adultos mayores.'
      }
    ],
    classes: [
      {
        id: 9,
        question: '¿Cómo reservo una clase grupal?',
        answer: 'Puedes reservar clases a través de nuestra app, sitio web o en recepción. Las reservas se abren 48 horas antes de cada clase.'
      },
      {
        id: 10,
        question: '¿Qué pasa si llego tarde a una clase?',
        answer: 'Por seguridad, no permitimos el ingreso después de los primeros 10 minutos de clase. Te recomendamos llegar 5-10 minutos antes.'
      },
      {
        id: 11,
        question: '¿Puedo cancelar una reserva de clase?',
        answer: 'Sí, puedes cancelar hasta 2 horas antes del inicio de la clase sin penalización. Cancelaciones tardías pueden resultar en cargos.'
      },
      {
        id: 12,
        question: '¿Necesito experiencia previa para las clases?',
        answer: 'Nuestras clases están diseñadas para todos los niveles. Los instructores ofrecen modificaciones para principiantes y opciones avanzadas.'
      }
    ],
    account: [
      {
        id: 13,
        question: '¿Cómo actualizo mi información personal?',
        answer: 'Puedes actualizar tu información en la sección "Mi Perfil" de la app o sitio web, o visitando recepción con una identificación oficial.'
      },
      {
        id: 14,
        question: '¿Cómo cambio mi método de pago?',
        answer: 'Ve a "Configuración" > "Métodos de Pago" en tu cuenta para agregar, editar o eliminar tarjetas de crédito/débito.'
      },
      {
        id: 15,
        question: '¿Puedo compartir mi membresía?',
        answer: 'No, las membresías son personales e intransferibles. Cada persona debe tener su propia membresía por razones de seguridad y seguro.'
      },
      {
        id: 16,
        question: '¿Cómo recupero mi contraseña?',
        answer: 'Haz clic en "¿Olvidaste tu contraseña?" en la página de inicio de sesión y sigue las instrucciones enviadas a tu correo electrónico.'
      }
    ],
    technical: [
      {
        id: 17,
        question: '¿Por qué no puedo iniciar sesión en la app?',
        answer: 'Verifica tu conexión a internet, asegúrate de usar las credenciales correctas y que tu app esté actualizada. Si persiste el problema, contacta soporte.'
      },
      {
        id: 18,
        question: '¿La app funciona sin conexión a internet?',
        answer: 'Algunas funciones como ver tu horario de clases reservadas funcionan sin conexión, pero necesitas internet para hacer nuevas reservas o pagos.'
      },
      {
        id: 19,
        question: '¿Cómo actualizo la aplicación?',
        answer: 'Ve a la App Store (iOS) o Google Play Store (Android), busca nuestra app y selecciona "Actualizar" si hay una versión disponible.'
      },
      {
        id: 20,
        question: '¿Por qué no recibo notificaciones?',
        answer: 'Verifica que las notificaciones estén habilitadas en la configuración de tu dispositivo y en la configuración de la app.'
      }
    ]
      };
      
      setFaqs(defaultFaqs);
    } catch (error) {
      console.error('Error loading FAQs:', error);
      // Mantener FAQs vacías en caso de error
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const contactOptions = [
    {
      icon: Phone,
      title: 'Teléfono',
      description: 'Llámanos para asistencia inmediata',
      contact: '+52 (55) 1234-5678',
      hours: 'Lun-Vie 8:00 AM - 8:00 PM'
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'Envíanos un correo y te responderemos pronto',
      contact: 'soporte@gimnasio.com',
      hours: 'Respuesta en 24 horas'
    },
    {
      icon: MessageCircle,
      title: 'Chat en Vivo',
      description: 'Chatea con nuestro equipo de soporte',
      contact: 'Disponible en la app',
      hours: 'Lun-Vie 9:00 AM - 6:00 PM'
    }
  ];

  const resources = [
    {
      icon: Video,
      title: 'Videos Tutoriales',
      description: 'Aprende a usar el equipamiento y técnicas de ejercicio',
      link: '#'
    },
    {
      icon: FileText,
      title: 'Guías de Entrenamiento',
      description: 'Rutinas y planes de entrenamiento descargables',
      link: '#'
    },
    {
      icon: Book,
      title: 'Manual del Usuario',
      description: 'Guía completa de todas las funciones y servicios',
      link: '#'
    }
  ];

  const filteredFaqs = faqs[activeCategory]?.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Centro de Ayuda</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encuentra respuestas a tus preguntas o contacta a nuestro equipo de soporte
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar en preguntas frecuentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Categorías</h2>
              <nav className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                        activeCategory === category.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{category.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* FAQs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Preguntas Frecuentes - {categories.find(c => c.id === activeCategory)?.name}
                </h2>
              </div>
              <div className="p-6">
                {filteredFaqs.length > 0 ? (
                  <div className="space-y-4">
                    {filteredFaqs.map((faq) => (
                      <div key={faq.id} className="border border-gray-200 rounded-lg">
                        <button
                          onClick={() => toggleFaq(faq.id)}
                          className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900">{faq.question}</span>
                          {expandedFaq === faq.id ? (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                        {expandedFaq === faq.id && (
                          <div className="px-4 pb-3 text-gray-600 border-t border-gray-200 bg-gray-50">
                            <p className="pt-3">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No se encontraron preguntas que coincidan con tu búsqueda.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Options */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">¿Necesitas más ayuda?</h2>
                <p className="text-gray-600 mt-1">Nuestro equipo está aquí para ayudarte</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {contactOptions.map((option, index) => {
                    const Icon = option.icon;
                    return (
                      <div key={index} className="text-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                        <Icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                        <h3 className="font-semibold text-gray-900 mb-2">{option.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                        <p className="text-sm font-medium text-blue-600">{option.contact}</p>
                        <p className="text-xs text-gray-500 mt-1">{option.hours}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recursos Útiles</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {resources.map((resource, index) => {
                    const Icon = resource.icon;
                    return (
                      <a
                        key={index}
                        href={resource.link}
                        className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                      >
                        <Icon className="h-6 w-6 text-blue-600 mt-1" />
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
                          <p className="text-sm text-gray-600">{resource.description}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
import React, { useState } from 'react';
import { Settings, Bell, Shield, Palette, Globe, Save, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const SettingsPage = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    // Notificaciones
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    classReminders: true,
    paymentReminders: true,
    promotionalEmails: false,
    
    // Privacidad
    profileVisibility: 'members', // 'public', 'members', 'private'
    showActivity: true,
    showProgress: false,
    
    // Apariencia
    theme: 'light', // 'light', 'dark', 'auto'
    language: 'es', // 'es', 'en'
    timezone: 'America/Mexico_City',
    
    // Seguridad
    twoFactorAuth: false,
    sessionTimeout: 30, // minutos
    loginAlerts: true
  });
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('notifications');

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Aquí se conectaría con la API del backend
      console.log('Saving settings:', settings);
      // await updateUserSettings(settings);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'notifications', name: 'Notificaciones', icon: Bell },
    { id: 'privacy', name: 'Privacidad', icon: Shield },
    { id: 'appearance', name: 'Apariencia', icon: Palette },
    { id: 'security', name: 'Seguridad', icon: Shield }
  ];

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notificaciones por Email</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Notificaciones generales</label>
              <p className="text-sm text-gray-500">Recibir notificaciones importantes del gimnasio</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Recordatorios de clases</label>
              <p className="text-sm text-gray-500">Recordatorios antes de tus clases programadas</p>
            </div>
            <input
              type="checkbox"
              checked={settings.classReminders}
              onChange={(e) => handleSettingChange('notifications', 'classReminders', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Recordatorios de pago</label>
              <p className="text-sm text-gray-500">Notificaciones sobre vencimientos de membresía</p>
            </div>
            <input
              type="checkbox"
              checked={settings.paymentReminders}
              onChange={(e) => handleSettingChange('notifications', 'paymentReminders', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Emails promocionales</label>
              <p className="text-sm text-gray-500">Ofertas especiales y promociones</p>
            </div>
            <input
              type="checkbox"
              checked={settings.promotionalEmails}
              onChange={(e) => handleSettingChange('notifications', 'promotionalEmails', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notificaciones Push</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Notificaciones push</label>
              <p className="text-sm text-gray-500">Recibir notificaciones en el navegador</p>
            </div>
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Notificaciones SMS</label>
              <p className="text-sm text-gray-500">Recibir notificaciones por mensaje de texto</p>
            </div>
            <input
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Visibilidad del Perfil</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">¿Quién puede ver tu perfil?</label>
            <select
              value={settings.profileVisibility}
              onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="public">Público</option>
              <option value="members">Solo miembros</option>
              <option value="private">Privado</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Mostrar actividad</label>
              <p className="text-sm text-gray-500">Permitir que otros vean tu actividad en el gimnasio</p>
            </div>
            <input
              type="checkbox"
              checked={settings.showActivity}
              onChange={(e) => handleSettingChange('privacy', 'showActivity', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Mostrar progreso</label>
              <p className="text-sm text-gray-500">Compartir tu progreso de entrenamiento</p>
            </div>
            <input
              type="checkbox"
              checked={settings.showProgress}
              onChange={(e) => handleSettingChange('privacy', 'showProgress', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tema</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Apariencia</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleSettingChange('appearance', 'theme', 'light')}
                className={`p-3 border rounded-lg flex items-center justify-center space-x-2 ${
                  settings.theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <Sun className="h-4 w-4" />
                <span className="text-sm">Claro</span>
              </button>
              <button
                onClick={() => handleSettingChange('appearance', 'theme', 'dark')}
                className={`p-3 border rounded-lg flex items-center justify-center space-x-2 ${
                  settings.theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <Moon className="h-4 w-4" />
                <span className="text-sm">Oscuro</span>
              </button>
              <button
                onClick={() => handleSettingChange('appearance', 'theme', 'auto')}
                className={`p-3 border rounded-lg flex items-center justify-center space-x-2 ${
                  settings.theme === 'auto' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span className="text-sm">Auto</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Idioma y Región</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Zona Horaria</label>
            <select
              value={settings.timezone}
              onChange={(e) => handleSettingChange('appearance', 'timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
              <option value="America/New_York">Nueva York (GMT-5)</option>
              <option value="Europe/Madrid">Madrid (GMT+1)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Autenticación</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Autenticación de dos factores</label>
              <p className="text-sm text-gray-500">Agregar una capa extra de seguridad a tu cuenta</p>
            </div>
            <input
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Alertas de inicio de sesión</label>
              <p className="text-sm text-gray-500">Recibir notificaciones cuando alguien acceda a tu cuenta</p>
            </div>
            <input
              type="checkbox"
              checked={settings.loginAlerts}
              onChange={(e) => handleSettingChange('security', 'loginAlerts', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sesión</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tiempo de espera de sesión</label>
            <select
              value={settings.sessionTimeout}
              onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={15}>15 minutos</option>
              <option value={30}>30 minutos</option>
              <option value={60}>1 hora</option>
              <option value={120}>2 horas</option>
              <option value={0}>Nunca</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'notifications':
        return renderNotificationsTab();
      case 'privacy':
        return renderPrivacyTab();
      case 'appearance':
        return renderAppearanceTab();
      case 'security':
        return renderSecurityTab();
      default:
        return renderNotificationsTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Guardando...' : 'Guardar Cambios'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 border-r border-gray-200">
              <nav className="p-4 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
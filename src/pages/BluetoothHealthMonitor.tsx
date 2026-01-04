import { Bluetooth, Settings, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import BackButton from '../components/BackButton';

export default function BluetoothHealthMonitor() {
  const [devices, setDevices] = useState<any[]>([]);
  const [connecting, setConnecting] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<string | null>(null);

  const requestDevices = async () => {
    setConnecting(true);
    try {
      if (!navigator.bluetooth) {
        alert('Bluetooth is not supported on this device');
        return;
      }

      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }],
        optionalServices: ['battery_service'],
      });

      setDevices(prev => [...prev, { id: device.id, name: device.name }]);
      setConnectedDevice(device.id);
    } catch (error) {
      if (error instanceof Error && error.message !== 'User cancelled the requestDevice() dialog.') {
        console.error('Bluetooth error:', error);
      }
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    setConnectedDevice(null);
  };

  const clearDevices = () => {
    setDevices([]);
    setConnectedDevice(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <BackButton />

        <div className="mt-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Bluetooth Health Monitor</h1>
          <p className="text-slate-600 mb-8">Connect your wearable health devices via Bluetooth</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <Bluetooth size={24} className="text-blue-600" />
                  Available Devices
                </h2>

                <div className="space-y-4 mb-6">
                  {devices.length === 0 ? (
                    <p className="text-slate-600 text-center py-8">No devices connected</p>
                  ) : (
                    devices.map((device) => (
                      <div
                        key={device.id}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          connectedDevice === device.id
                            ? 'bg-blue-50 border-blue-400'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Bluetooth size={20} className={connectedDevice === device.id ? 'text-blue-600' : 'text-slate-600'} />
                            <div>
                              <p className="font-semibold text-slate-900">{device.name}</p>
                              <p className="text-xs text-slate-600">{device.id}</p>
                            </div>
                          </div>
                          {connectedDevice === device.id && (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                              <span className="text-xs font-semibold text-green-600">Connected</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={requestDevices}
                    disabled={connecting}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-400"
                  >
                    <Bluetooth size={20} />
                    {connecting ? 'Scanning...' : 'Connect Device'}
                  </button>
                  {devices.length > 0 && (
                    <button
                      onClick={clearDevices}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
                    >
                      <RotateCcw size={20} />
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {connectedDevice && (
                <div className="bg-green-50 border border-green-200 rounded-xl shadow-lg p-8">
                  <h2 className="text-xl font-semibold text-green-900 mb-6">Device Metrics</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-green-200">
                      <p className="text-slate-600 text-sm mb-2">Heart Rate</p>
                      <p className="text-3xl font-bold text-green-600">72</p>
                      <p className="text-slate-500 text-xs">bpm</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-green-200">
                      <p className="text-slate-600 text-sm mb-2">Battery Level</p>
                      <p className="text-3xl font-bold text-green-600">85</p>
                      <p className="text-slate-500 text-xs">%</p>
                    </div>
                  </div>
                  <button
                    onClick={disconnect}
                    className="w-full mt-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Settings size={20} />
                  Supported Devices
                </h3>
                <div className="space-y-3 text-sm text-slate-600">
                  <div>
                    <p className="font-semibold text-slate-900">Heart Rate Monitors</p>
                    <p className="text-xs">Chest straps, arm bands</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Smartwatches</p>
                    <p className="text-xs">Apple Watch, Fitbit, Garmin</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Fitness Trackers</p>
                    <p className="text-xs">Most Bluetooth-enabled devices</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-blue-900 mb-3">Connection Tips</h3>
                <ul className="text-xs text-blue-800 space-y-2">
                  <li>• Enable Bluetooth on your device</li>
                  <li>• Keep device within 10 meters</li>
                  <li>• Check device battery level</li>
                  <li>• Pair before connecting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

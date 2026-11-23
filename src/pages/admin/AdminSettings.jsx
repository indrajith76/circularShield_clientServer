import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  History,
  ArrowRight,
} from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export const AdminSettings = () => {
  const navigate = useNavigate();
  const [saveToast, setSaveToast] = useState('');
  const [settings, setSettings] = useState({
    autoBlacklistThreshold: '85',
    maxScansPerMinute: '60',
    emergencyAlertBanner: false,
    enforceStrictOrgDomains: true,
    telecomWhistleblowerRelay: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaveToast('Security settings successfully committed to production config.');
    setTimeout(() => setSaveToast(''), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Settings' },
        ]}
        title="Admin Settings"
        subtitle="Configure detection engine thresholds, rate limiting, and emergency public broadcast banners."
      />

      {saveToast && (
        <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between text-xs font-semibold text-[#16A36A]">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{saveToast}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        <Card className="bg-white border-[#E2E8F0] shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-[#102C3A]">
              Automated Threat Containment Rules
            </CardTitle>
            <CardDescription>
              Control thresholds at which high-risk circulars are quarantined.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Auto-Quarantine Risk Score Threshold (0-100)"
                type="number"
                value={settings.autoBlacklistThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, autoBlacklistThreshold: e.target.value })
                }
                helperText="Circulars scoring above this are marked as suspicious automatically."
              />
              <Input
                label="Candidate Scan Rate Limit (Scans/Minute)"
                type="number"
                value={settings.maxScansPerMinute}
                onChange={(e) =>
                  setSettings({ ...settings, maxScansPerMinute: e.target.value })
                }
                helperText="Prevents scraper bots from exhausting backend resources."
              />
            </div>

            <div className="space-y-3 pt-3 border-t border-[#F1F5F8]">
              <label className="flex items-start gap-3 p-3 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enforceStrictOrgDomains}
                  onChange={(e) =>
                    setSettings({ ...settings, enforceStrictOrgDomains: e.target.checked })
                  }
                  className="mt-1 text-[#087F70] rounded border-[#CBD5E1]"
                />
                <div className="text-xs">
                  <span className="font-bold text-[#102C3A] block">
                    Enforce Strict Corporate Domain Checks
                  </span>
                  <span className="text-[#64748B]">
                    Automatically flag any verified enterprise circular using public webmail providers.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.telecomWhistleblowerRelay}
                  onChange={(e) =>
                    setSettings({ ...settings, telecomWhistleblowerRelay: e.target.checked })
                  }
                  className="mt-1 text-[#087F70] rounded border-[#CBD5E1]"
                />
                <div className="text-xs">
                  <span className="font-bold text-[#102C3A] block">
                    Automated BTRC & Police Syndicate Feed
                  </span>
                  <span className="text-[#64748B]">
                    Relay confirmed fraudulent mobile banking wallets to national law enforcement.
                  </span>
                </div>
              </label>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="secondary" size="md">
                Save Platform Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Quick Access */}
        <Card className="bg-white border-[#E2E8F0] shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-[#102C3A] flex items-center gap-2">
              <History size={18} className="text-[#087F70]" />
              <span>Administrative Audit & Activity Log</span>
            </CardTitle>
            <CardDescription>
              Review immutable cryptographic audit trails of operator actions, policy updates, and enforcement decisions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              type="button"
              variant="outline"
              size="sm"
              rightIcon={ArrowRight}
              onClick={() => navigate('/admin/activity')}
            >
              Open Audit Ledger
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default AdminSettings;

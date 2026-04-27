import { useState } from 'react';
import { Upload as UploadIcon, MapPin, X, FileVideo, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cities } from '@/data/mockData';

export function Upload() {
  const [activeTab, setActiveTab] = useState('spot');
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [spotForm, setSpotForm] = useState({ name: '', address: '', latitude: '', longitude: '', opentime: '', ticket: '', introduction: '', type: '', dqid: '' });
  const [cultureForm, setCultureForm] = useState({ title: '', lssj: '', sdbj: '', xgrw: '', jtqj: '', wwgj: '', tourId: '', historyPeriod: '' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFiles([]); setPreviewUrls([]);
      setSpotForm({ name: '', address: '', latitude: '', longitude: '', opentime: '', ticket: '', introduction: '', type: '', dqid: '' });
      setCultureForm({ title: '', lssj: '', sdbj: '', xgrw: '', jtqj: '', wwgj: '', tourId: '', historyPeriod: '' });
      setTimeout(() => setSubmitted(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">上传红色旅游资源</h1>
          <p className="text-gray-500">分享您发现的红色景点或红色文化资料，审核通过后将纳入平台数据库</p>
        </div>

        {submitted && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <span>提交成功！您的资源已进入审核队列，审核通过后将正式展示。</span>
          </div>
        )}

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="spot"><MapPin className="w-4 h-4 mr-2" />上传景点</TabsTrigger>
                <TabsTrigger value="culture"><UploadIcon className="w-4 h-4 mr-2" />上传红色文化</TabsTrigger>
              </TabsList>

              <TabsContent value="spot" className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>景点名称 <span className="text-red-500">*</span></Label>
                    <Input placeholder="请输入景点名称" value={spotForm.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpotForm({ ...spotForm, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>所属地区 <span className="text-red-500">*</span></Label>
                    <Select value={spotForm.dqid} onValueChange={(v: string) => setSpotForm({ ...spotForm, dqid: v })}>
                      <SelectTrigger><SelectValue placeholder="选择所属地区" /></SelectTrigger>
                      <SelectContent>{cities.map((city) => <SelectItem key={city.id} value={city.id}>{city.city}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>详细地址 <span className="text-red-500">*</span></Label>
                  <Input placeholder="请输入详细地址" value={spotForm.address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpotForm({ ...spotForm, address: e.target.value })} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>经度</Label>
                    <Input placeholder="自动获取或手动填写" value={spotForm.longitude} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpotForm({ ...spotForm, longitude: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>纬度</Label>
                    <Input placeholder="自动获取或手动填写" value={spotForm.latitude} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpotForm({ ...spotForm, latitude: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>景点类型</Label>
                    <Select value={spotForm.type} onValueChange={(v: string) => setSpotForm({ ...spotForm, type: v })}>
                      <SelectTrigger><SelectValue placeholder="选择类型" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="革命遗址">革命遗址</SelectItem>
                        <SelectItem value="革命纪念馆">革命纪念馆</SelectItem>
                        <SelectItem value="革命旧址">革命旧址</SelectItem>
                        <SelectItem value="战争遗址">战争遗址</SelectItem>
                        <SelectItem value="历史遗址">历史遗址</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>开放时间</Label>
                    <Input placeholder="如：09:00-17:00" value={spotForm.opentime} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpotForm({ ...spotForm, opentime: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>门票价格</Label>
                    <Input placeholder="如：免费 或 30元" value={spotForm.ticket} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpotForm({ ...spotForm, ticket: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>景点简介</Label>
                  <Textarea placeholder="请输入景点简介..." rows={4} value={spotForm.introduction} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSpotForm({ ...spotForm, introduction: e.target.value })} />
                </div>
              </TabsContent>

              <TabsContent value="culture" className="space-y-5">
                <div className="space-y-2">
                  <Label>标题 <span className="text-red-500">*</span></Label>
                  <Input placeholder="请输入红色文化标题" value={cultureForm.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCultureForm({ ...cultureForm, title: e.target.value })} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>关联景点</Label>
                    <Input placeholder="选择关联景点（可选）" value={cultureForm.tourId} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCultureForm({ ...cultureForm, tourId: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>历史时期</Label>
                    <Select value={cultureForm.historyPeriod} onValueChange={(v: string) => setCultureForm({ ...cultureForm, historyPeriod: v })}>
                      <SelectTrigger><SelectValue placeholder="选择历史时期" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="近代屈辱与抗争">近代屈辱与抗争</SelectItem>
                        <SelectItem value="土地革命战争时期">土地革命战争时期</SelectItem>
                        <SelectItem value="抗日战争时期">抗日战争时期</SelectItem>
                        <SelectItem value="解放战争时期">解放战争时期</SelectItem>
                        <SelectItem value="社会主义建设时期">社会主义建设时期</SelectItem>
                        <SelectItem value="改革开放时期">改革开放时期</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {[{ key: 'lssj', label: '历史事件' }, { key: 'sdbj', label: '时代背景' }, { key: 'xgrw', label: '相关人物' }, { key: 'jtqj', label: '具体情节' }, { key: 'wwgj', label: '文物古迹' }].map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label>{field.label}</Label>
                    <Textarea placeholder={`请输入${field.label}...`} rows={3} value={cultureForm[field.key as keyof typeof cultureForm]} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCultureForm({ ...cultureForm, [field.key]: e.target.value })} />
                  </div>
                ))}
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t space-y-3">
              <Label>上传图片/视频</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-red-300 transition-colors">
                <input type="file" id="file-upload" multiple accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
                    <UploadIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">点击上传或拖拽文件到此处</p>
                  <p className="text-xs text-gray-400">支持 JPG、PNG、MP4 格式，单个文件不超过 50MB</p>
                </label>
              </div>

              {previewUrls.length > 0 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mt-4">
                  {previewUrls.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      {files[idx]?.type.startsWith('video/') ? (
                        <div className="w-full h-full flex items-center justify-center"><FileVideo className="w-8 h-8 text-gray-400" /></div>
                      ) : (
                        <img src={url} alt="preview" className="w-full h-full object-cover" />
                      )}
                      <button onClick={() => removeFile(idx)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={() => { setSpotForm({ name: '', address: '', latitude: '', longitude: '', opentime: '', ticket: '', introduction: '', type: '', dqid: '' }); setCultureForm({ title: '', lssj: '', sdbj: '', xgrw: '', jtqj: '', wwgj: '', tourId: '', historyPeriod: '' }); setFiles([]); setPreviewUrls([]); }}>重置</Button>
              <Button className="bg-red-700 hover:bg-red-800" onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? '提交中...' : '提交审核'}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

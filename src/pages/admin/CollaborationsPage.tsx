import { useState, useEffect } from 'react';
import { collaborationsService, Collaboration } from '../../lib/services/collaborationsService';
import { useToast } from '../../hooks/useToast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../../components/ui/Dialog';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Plus, Pencil, Trash2, Handshake } from 'lucide-react';

export default function CollaborationsPage() {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCollaboration, setSelectedCollaboration] = useState<Collaboration | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    partner_name: '',
    description: '',
    website: '',
    is_active: true,
  });

  const fetchCollaborations = async () => {
    try {
      setLoading(true);
      const data = await collaborationsService.getAll();
      setCollaborations(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch collaborations');
      toast({
        title: 'Error',
        description: 'Failed to fetch collaborations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedCollaboration) {
        await collaborationsService.update(selectedCollaboration.id, formData);
        toast({
          title: 'Success',
          description: 'Collaboration updated successfully',
          variant: 'success',
        });
      } else {
        await collaborationsService.create(formData);
        toast({
          title: 'Success',
          description: 'Collaboration created successfully',
          variant: 'success',
        });
      }
      setIsDialogOpen(false);
      fetchCollaborations();
      resetForm();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save collaboration',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (collaboration: Collaboration) => {
    setSelectedCollaboration(collaboration);
    setFormData({
      partner_name: collaboration.partner_name,
      description: collaboration.description,
      website: collaboration.website || '',
      is_active: collaboration.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCollaboration) return;
    try {
      await collaborationsService.delete(selectedCollaboration.id);
      toast({
        title: 'Success',
        description: 'Collaboration deleted successfully',
        variant: 'success',
      });
      fetchCollaborations();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete collaboration',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      partner_name: '',
      description: '',
      website: '',
      is_active: true,
    });
    setSelectedCollaboration(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>{error}</p>
        <Button onClick={fetchCollaborations} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Collaborations</h1>
          <p className="text-muted-foreground">Manage partner organizations and collaborations</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Add Partner
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Handshake className="w-5 h-5" />
            All Partners ({collaborations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collaborations.map((collab) => (
                <TableRow key={collab.id}>
                  <TableCell className="font-medium">{collab.partner_name}</TableCell>
                  <TableCell className="max-w-xs truncate">{collab.description}</TableCell>
                  <TableCell>
                    {collab.website && (
                      <a href={collab.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Visit
                      </a>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${collab.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {collab.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(collab)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          setSelectedCollaboration(collab);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {collaborations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No collaborations found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCollaboration ? 'Edit Collaboration' : 'Add New Partner'}</DialogTitle>
            <DialogDescription>
              {selectedCollaboration ? 'Update collaboration details' : 'Add a new partner organization'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="partner_name">Partner Name</Label>
              <Input
                id="partner_name"
                value={formData.partner_name}
                onChange={(e) => setFormData({ ...formData, partner_name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{selectedCollaboration ? 'Update' : 'Add'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Collaboration"
        description={`Are you sure you want to remove the partnership with ${selectedCollaboration?.partner_name}? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmText="Remove"
        variant="destructive"
      />
    </div>
  );
}

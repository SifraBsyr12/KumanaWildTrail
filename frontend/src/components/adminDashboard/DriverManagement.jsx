import { useState } from "react"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent
} from "@/components/ui/adminDashboard-ui/card"
import { Button } from "@/components/ui/adminDashboard-ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/adminDashboard-ui/dialog"
import { Input } from "@/components/ui/adminDashboard-ui/input"
import { Label } from "@/components/ui/adminDashboard-ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/adminDashboard-ui/table"


export default function DriverManagement() {
    const [drivers, setDrivers] = useState([
        { id: 1, name: "Sunil Perera", license: "KL-2033", phone: "0771234567", vehicle: "KU-4856", status: "Active" },
        { id: 2, name: "Amila Bandara", license: "GA-5521", phone: "0769988776", vehicle: "KU-3369", status: "Inactive" }
    ])
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingDriver, setEditingDriver] = useState(null)
    const [formData, setFormData] = useState({ name: "", license: "", phone: "", vehicle: "", status: "Active" })
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedDriver, setSelectedDriver] = useState(null)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleAdd = () => {
        const newDriver = { id: Date.now(), ...formData }
        setDrivers((prev) => [...prev, newDriver])
        setShowAddModal(false)
        setFormData({ name: "", license: "", phone: "", vehicle: "", status: "Active" })
    }

    const handleEdit = (driver) => {
        setEditingDriver(driver)
        setFormData(driver)
        setShowEditModal(true)
    }

    const handleUpdate = () => {
        setDrivers((prev) =>
            prev.map((d) => (d.id === editingDriver.id ? { ...editingDriver, ...formData } : d))
        )
        setShowEditModal(false)
        setEditingDriver(null)
    }

    const handleDeleteClick = (driver) => {
        setSelectedDriver(driver)
        setShowDeleteModal(true)
    }

    const confirmDelete = () => {
        setDrivers((prev) => prev.filter((d) => d.id !== selectedDriver.id))
        setShowDeleteModal(false)
        setSelectedDriver(null)
    }

    const cancelDelete = () => {
        setShowDeleteModal(false)
        setSelectedDriver(null)
    }


    return (
        <section id="drivers" className="pt-1 bg-white  rounded-lg shadow-md">
            <Card className='border-0'>
                <CardHeader className="flex flex-col items-center text-center space-y-2">
                    <CardTitle className="font-playfair text-lg font-bold text-safari-forest">
                        Driver Management
                    </CardTitle>
                    <CardDescription className="text-safari-test">
                        Add and manage safari drivers
                    </CardDescription>
                    <Button  className='bg-safari-green' onClick={() => setShowAddModal(true)}>+ Add Driver</Button>
                </CardHeader>


                <CardContent className="text-black w-full">
                    <div className="w-full overflow-x-auto">
                        <Table className="w-full table-auto">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-1/6">Name</TableHead>
                                    <TableHead className="w-1/6">License ID</TableHead>
                                    <TableHead className="w-1/6">Phone</TableHead>
                                    <TableHead className="w-1/6">Vehicle</TableHead>
                                    <TableHead className="w-1/6">Status</TableHead>
                                    <TableHead className="w-1/6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {drivers.map((driver) => (
                                    <TableRow key={driver.id}>
                                        <TableCell>{driver.name}</TableCell>
                                        <TableCell>{driver.license}</TableCell>
                                        <TableCell>{driver.phone}</TableCell>
                                        <TableCell>{driver.vehicle}</TableCell>
                                        <TableCell>{driver.status}</TableCell>
                                        <TableCell className="flex gap-2 justify-start">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(driver)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDeleteClick(driver)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>

            </Card>

            {/* Add Modal */}
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add New Driver</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div>
                            <Label>Name</Label>
                            <Input name="name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input name="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Password</Label>
                            <Input name="password" value={formData.password} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>License ID</Label>
                            <Input name="license" value={formData.license} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Phone</Label>
                            <Input name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Vehicle No</Label>
                            <Input name="vehicle" value={formData.vehicle} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Status</Label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md p-2 w-full"
                            >
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleAdd}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Driver</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div>
                            <Label>Name</Label>
                            <Input name="name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>License ID</Label>
                            <Input name="license" value={formData.license} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Phone</Label>
                            <Input name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Vehicle No</Label>
                            <Input name="vehicle" value={formData.vehicle} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Status</Label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md p-2 w-full"
                            >
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleUpdate}>Update</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            {/* Driver delete model */}
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <p className="py-4">
                        Are you sure you want to delete <strong>{selectedDriver?.name}</strong>?
                    </p>
                    <DialogFooter className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={cancelDelete}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    )
}

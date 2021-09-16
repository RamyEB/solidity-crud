const Crud = artifacts.require('Crud')

contract('Crud', () => {
    let crud = null;
    before(async () => {
        crud = await Crud.deployed();
    })

    it('create & read', async () => {
        await crud.create('Frank');
        let result = await crud.read(1);
        assert(result[1] === 'Frank' )
    })

    it('update', async () => {
        await crud.update(1, 'Ramy');
        let result = await crud.read(1);
        assert(result[1] === 'Ramy' )
    })

    it('update failing', async () => {
        try{
            await crud.update(4, 'Ramy');
        }
        catch(e){
            assert(e.message.includes('User does not exist!'));
            return;
        }
        assert(false);
    })


    it('destroy', async () => {
        await crud.destroy(1);
        try{
            await crud.read(1);
        }
        catch(e){
            assert(e.message.includes('User does not exist!'));
            return;
        }
        assert(false);
    })

    it('should not destroy an existing user', async () => {
        try{
            await crud.destroy(4);
        }
        catch(e){
            assert(e.message.includes('User does not exist!'));
            return;
        }
        assert(false);
    })

})
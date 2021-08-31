<?php

namespace MicroweberPackages\Page\Repositories;

use MicroweberPackages\Core\Repositories\BaseRepository;
use MicroweberPackages\Page\Events\PageIsCreating;
use MicroweberPackages\Page\Events\MenuIsUpdating;
use MicroweberPackages\Page\Events\MenuWasCreated;
use MicroweberPackages\Page\Events\MenuWasDeleted;
use MicroweberPackages\Page\Events\MenuWasUpdated;
use MicroweberPackages\Page\Models\Page;

class PageRepository extends BaseRepository
{
    public function __construct(Page $model)
    {
        $this->model = $model;
    }

    public function create($data)
    {
        event($event = new PageIsCreating($data));

        $page = $this->model->create($data);

        event(new MenuWasCreated($page, $data));

        return $page;
    }

    public function update($data, $id)
    {
        $page = $this->model->find($id);

        event($event = new MenuIsUpdating($page, $data));

        $page->update($data);

        event(new MenuWasUpdated($page, $data));

        return $page;
    }

    public function delete($id)
    {
        $page = $this->model->find($id);

        event(new MenuWasDeleted($page));

        return $page->delete();
    }


    public function destroy($ids)
    {
        event(new PageWasDestroy($ids));

        return $this->model->destroy($ids);
    }
}

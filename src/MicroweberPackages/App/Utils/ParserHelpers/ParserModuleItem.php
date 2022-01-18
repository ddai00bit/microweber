<?php

namespace MicroweberPackages\App\Utils\ParserHelpers;

class ParserModuleItem
{
    public $data = [];
    public $isProcessed = false;
    public $output = '';

    /**
     * @return string
     */
    public function getOutput(): string
    {
        return $this->output;
    }

    /**
     * @param string $output
     */
    public function setOutput(string $output): void
    {
        $this->output = $output;
    }

    public function getReplaceKey()
    {
        if (isset($this->data['replace_key'])) {
            return $this->data['replace_key'];
        }
        return false;
    }

    /**
     * @return bool
     */
    public function isProcessed(): bool
    {
        return $this->isProcessed;
    }

    /**
     * @param bool $isProcessed
     */
    public function setIsProcessed(bool $isProcessed): void
    {
        $this->isProcessed = $isProcessed;
    }



    public function setReplaceKey($key)
    {
        $this->data['replace_key'] = $key;
    }


    public function getReplaceValue()
    {
        if (isset($this->data['replace_value'])) {
            return $this->data['replace_value'];
        }
        return false;
    }

    public function setReplaceValue($value)
    {
        $this->data['replace_value'] = $value;
    }


    public function getModuleName()
    {
        if (isset($this->data['module_name'])) {
            return $this->data['module_name'];
        }
        return false;
    }

    public function setModuleName($value)
    {
        $this->data['module_name'] = $value;
    }

    public function getEditFieldRel()
    {
        if (isset($this->data['edit_field_rel'])) {
            return $this->data['edit_field_rel'];
        }
        return false;
    }

    public function setEditFieldRel($rel)
    {
        $this->data['edit_field_rel'] = $rel;
    }


    public function getEditFieldRelId()
    {
        if (isset($this->data['edit_field_rel_id'])) {
            return $this->data['edit_field_rel_id'];
        }
        return false;
    }

    public function setEditFieldRelId($rel_id)
    {
        $this->data['edit_field_rel_id'] = $rel_id;

    }

    public function getEditFieldRelType()
    {
        if (isset($this->data['edit_field_rel_type'])) {
            return $this->data['edit_field_rel_type'];
        }
        return false;
    }

    public function setEditFieldRelType($rel_type)
    {
        $this->data['edit_field_rel_type'] = $rel_type;

    }


    public function getEditField()
    {
        if (isset($this->data['edit_field'])) {
            return $this->data['edit_field'];
        }
        return false;
    }

    public function setEditField($field)
    {
        $this->data['edit_field'] = $field;

    }

}

